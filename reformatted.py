import csv
from bs4 import BeautifulSoup
from datetime import datetime
import os
from jinja2 import Environment, FileSystemLoader

if os.path.exists("flight_data_temp.csv"):
    os.remove("flight_data_temp.csv")

# Define the header row for the CSV file.
header_row = [
    'Activity', 'Departure', 'Arrival', 'Date', 'Off', 'Date', 'On', 'Aircraft Reg', 'Type', 'Crew On Board'
]

version_mapping = {"32C": "A320", "32N": "A20N"}
# List of months in order
months = ['feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct']

# Create the CSV file with the header row
with open("flight_data_temp.csv", "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header_row)

# Define the column headings
columns = [
    "Activity",
    "Departure",
    "Arrival",
    "Start",
    "End",
    "Aircraft Reg",
    "Type",
    "Crew On Board",
]

roster_columns = [
    "Roster Designators"
]

# Select the correct HTML file in order of months
for month in months:
    file_name = f"logs/{month}.html"

    # Read the contents of the HTML file
    try:
        with open(file_name, 'r') as file:
            contents = file.read()
    except FileNotFoundError:
        print(f"The file '{file_name}' does not exist.")
        continue

    # Parse the garbage HTML using BeautifulSoup
    soup = BeautifulSoup(contents, "html.parser")

    # Find all div elements with class "calendarDayDiv"
    calendar_days = soup.find_all("div", class_="calendarDayDiv")

    # Loop through each calendar day
    for day in calendar_days:
        # Find all div elements with class "ItemChildDetails"
        item_details_divs = day.find_all("div", class_="ItemChildDetails")

        for item_details_div in item_details_divs:
            # Check if it is a positioning or deadhead flight
            skip_flight = False

            # Check if the div contains Roster Designators and the value is P or D
            for tr in item_details_div.find_all("tr"):
                for td in tr.find_all("td"):
                    if td.text.strip() in roster_columns:
                        value = td.find_next("td").text.strip()
                        if value == "P" or value == "D":
                            skip_flight = True
                            break
                if skip_flight:
                    break
            if skip_flight:
                continue

            # Find all table row tags in the current ItemChildDetails div
            tr_tags = item_details_div.find_all("tr")

            # Check if all columns are present in the current ItemChildDetails div
            present_columns = {td.text.strip() for tr in tr_tags for td in tr.find_all("td") if
                               td.text.strip() in columns}

            if set(columns) == present_columns:
                # Initialize a dictionary to store the data for this flight
                flight_data = {k: "" for k in columns}

                # Loop through each row in the table for this ItemChildDetails div
                for tr in tr_tags:
                    # Loop through each cell in the row
                    for td in tr.find_all("td"):
                        # Check if the contents of the cell match any of the specified values
                        if td.text.strip() in columns:
                            key = td.text.strip()
                            value = td.find_next("td").text.strip()
                            # Add the data to the flight_data dictionary
                            flight_data[key] = value

                        # Update the Version key based on mapping
                        version = flight_data['Type']
                        if version in version_mapping:
                            flight_data['Type'] = version_mapping[version]

                with open("flight_data_temp.csv", "a", newline="") as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow([
                        flight_data['Activity'],
                        flight_data['Departure'].split(' - ')[0],
                        flight_data['Arrival'].split(' - ')[0],
                        flight_data['Start'].split(' ')[0],  # date
                        flight_data['Start'].split(' ')[1],  # off
                        flight_data['End'].split(' ')[0],  # date
                        flight_data['End'].split(' ')[1],  # on
                        f"{flight_data['Aircraft Reg'][:2]}-{flight_data['Aircraft Reg'][2:]}",
                        flight_data['Type'],
                        flight_data['Crew On Board']
                    ])


with open('flight_data_temp.csv', 'r', newline='') as infile:
    reader = csv.reader(infile)

    # Write the header row to the output file
    header_row = next(reader)
    header_row.insert(7, 'Total Time')

    # Store the updated rows in a list
    updated_rows = [header_row]

    # Loop through each row in the input file
    for row in reader:
        # Parse the off and on times as datetime objects
        off_time = datetime.strptime(row[4], '%H:%M')
        on_time = datetime.strptime(row[6], '%H:%M')

        # Calculate the difference between the on and off times
        delta = on_time - off_time

        # Convert the total block time to hours and minutes
        total_block_time_hours = delta.seconds // 3600
        total_block_time_minutes = (delta.seconds % 3600) // 60

        # Format the total block time as a string in HH:MM format
        total_block_time_str = f'{total_block_time_hours:02}:{total_block_time_minutes:02}'

        # Insert the total time into the row
        row.insert(7, total_block_time_str)

        # Add the updated row to the list
        updated_rows.append(row)

# Write the updated rows to the output file
with open('output.csv', 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerows(updated_rows)

# Calculate the total cumulative flight time
total_hours = 0
total_minutes = 0

with open('output.csv', 'r', newline='') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # skip header row

    for row in reader:
        # Get the total time from the 8th column
        total_time = row[7]

        # Calculate the hours and minutes from the total time
        total_hours += int(total_time.split(':')[0])
        total_minutes += int(total_time.split(':')[1])

# Convert the total minutes to hours if greater than 60
total_hours += total_minutes // 60
total_minutes %= 60

# Print the total cumulative flight time in HH:MM format
print(f"Total cumulative flight time: {total_hours:02}:{total_minutes:02}")
# Format the total duration as a string
total_duration_str = f"{total_hours:02}:{total_minutes:02}"

# Load the CSV data
with open('output.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)
    data = list(reader)

# Create a Jinja environment and load the template
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.html')

# Render the template with the data
output = template.render(header=header, data=data, total_duration_str=total_duration_str)

# Write the output to a file
with open('output.html', 'w') as f:
    f.write(output)
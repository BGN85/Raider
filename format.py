import csv
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re

# List of months in order
months = ['feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct']

# Labels to look for in the table
labels = ['Departure', 'Start', 'Arrival', 'End', 'Aircraft Reg', 'Type']

# List to store the extracted data
all_data = []

for month in months:
    file_name = f"logs/{month}.html"

    # Read the contents of the file
    try:
        with open(file_name, 'r') as file:
            contents = file.read()
    except FileNotFoundError:
        print(f"The file '{file_name}' does not exist.")
        continue

    soup = BeautifulSoup(contents, 'html.parser')

    # Find all table rows
    rows = soup.find_all('tbody')

    # List to store the extracted data for the month
    data = []

    # Iterate over each tbody
    all_data_found = 0
    tables_with_missing_labels = 0
    for tbody in rows:
        # Find all table rows in the tbody
        tbody_rows = tbody.find_all('tr')

        # List to store the extracted data for the tbody
        table_data = []

        # List to store the labels found in the tbody
        found_labels = []

        # Iterate over each row
        for row in tbody_rows:
            cells = row.find_all('td')
            if len(cells) > 0:
                # Extract the label
                label = cells[0].text.strip()

                # Check if the label is in the list of labels we're looking for
                if label in labels:
                    found_labels.append(label)
                    row_data = [cell.text.strip() for cell in cells[1:]]
                    row_data = ' '.join(row_data)
                    row_data = re.sub(r'[/\\ ]+', ',', row_data)
                    row_data = row_data.replace('"', '')  # Remove double quotes
                    table_data.extend([label] + [row_data])

        if set(labels) == set(found_labels):
            data.append(table_data)
            all_data_found += 1
        else:
            tables_with_missing_labels += 1

    if tables_with_missing_labels > 0:
        print(f"All data was found in {all_data_found} tables, whilst {tables_with_missing_labels} "
              f"didn't have all labels.")
    else:
        print(f"All the data was present in all tables for {month.capitalize()}.")

    all_data.extend(data)

# Write the extracted data to a CSV file
with open('main.csv', 'w', newline='') as file:
    writer = csv.writer(file, quoting=csv.QUOTE_NONE, escapechar='\\')
    for table in all_data:
        row_data = []
        for label in labels:
            for i in range(len(table)):
                if table[i] == label:
                    # Check for Departure and Arrival columns
                    if label == 'Departure' or label == 'Arrival':
                        cells = table[i+1].split(",")
                        cells = [cell[:2] if 4 < len(cell) < 14 else cell for cell in cells]
                        row_data.extend([cell for cell in cells if len(cell) >= 3])
                    else:
                        row_data.append(table[i+1])
        row_data = [cell for cell in row_data if cell not in ['APT', 'ROME',
                                                              'VINCI-FIUMICINO',
                                                              'INTL', 'REYKJAVIK-KEFLAVIK']]
        writer.writerow(row_data)

# Read the contents of the file and remove backslashes
with open('main.csv', 'r') as file:
    contents = file.read()
contents = contents.replace('\\', '')

# Process the CSV data
reader = csv.reader(contents.splitlines())
data = []
total_duration = timedelta()
for row in reader:
    # Add the dash to the AC. registration
    row[16] = row[16][:2] + '-' + row[16][2:]
    # Replace 32C with A320 and 32N with A20N
    if row[17] == '32C':
        row[17] = 'A320'
    elif row[17] == '32N':
        row[17] = 'A20N'
    # Calculate the block time
    dep_time = datetime.strptime(row[3], '%H:%M')
    arr_time = datetime.strptime(row[11], '%H:%M')
    block_time = arr_time - dep_time
    total_duration += block_time
    # Add the formatted block time to the row
    hours, minutes = divmod(block_time.seconds // 60, 60)
    row.append(f"{hours:02d}:{minutes:02d}")
    # Add the row to the output data
    data.append(row)

# Write the output data to a file
with open('main.csv', 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerows(data)

# Print the cumulative total of hours and minutes in the last column in hh:mm format
hours, minutes = divmod(total_duration.seconds // 60, 60)
print(f"Cumulative total: {hours:02d}:{minutes:02d}")

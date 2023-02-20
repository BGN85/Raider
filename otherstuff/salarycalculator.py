# Define the fixed salary levels for captains and first officers
captain_fixed_salary_levels = {
    1: 7179.71,
    2: 7996.56,
    3: 8727.43,
    4: 9372.31,
    5: 9931.21,
    6: 10404.13,
    7: 10791.06
}

first_officer_fixed_salary_levels = {
    1: 4299.23,
    2: 4729.15,
    3: 5159.07,
    4: 5588.99,
    5: 6018.92,
    6: 6448.84,
    7: 6878.76
}

# Define the block hour rates for each level
block_hour_rates = {
    75: 1 / 75,
    90: 1 / 75,
    750: 0.75 / 75
}

# Get the pilot's level and number of block hours flown
is_captain = input("Are you a Captain? Y/N: ")
if is_captain.lower() == "y":
    fixed_salary_levels = captain_fixed_salary_levels
    print("Good for you, sir. I salute you.")
elif is_captain.lower() == "n":
    fixed_salary_levels = first_officer_fixed_salary_levels
    print("Down to the dungeons with your pay!")
else:
    print("Invalid input. Please enter Y or N.")

if is_captain.lower() in ("y", "n"):
    level = int(input("Enter your salary level: "))
    if level <= 3:
        print("Still pretty shitty there bucko.")
    if level == 4:
        print("Getting somewhere.")
    if level > 4:
        print("Now we're talking. Beers on you.")
else:
    print("Invalid pilot type")

block_hours = float(input("Enter your number of block hours flown: "))

if is_captain.lower() == "n":
    print("Welcome, First Officer.")
    level = int(input("Enter your salary level: "))
    if level < 3:
        print("It's a start.")
    elif level == 4:
        print("You're on your way.")
    else:
        print("Keep up the good work.")
else:
    print("Invalid response. Please enter Y or N.")

    block_hours = float(input("Enter your number of block hours flown: "))

    # Calculate the gross salary
    fixed_salary = fixed_salary_levels[level]
    shift_payment = fixed_salary * 0.163
    if block_hours <= 75:
        gross_salary = fixed_salary + shift_payment
    elif block_hours <= 90:
        gross_salary = fixed_salary + shift_payment + (block_hours - 75) * fixed_salary / 75
    else:
        gross_salary = fixed_salary + shift_payment + 15 * fixed_salary / 75 + (block_hours - 90) * 1.5 * fixed_salary / 75

fixed_salary
# Print the results
print("Gross Salary: €%.2f" % gross_salary)
print("Shift Payment: €%.2f" % shift_payment)

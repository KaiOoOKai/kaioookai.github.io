import csv

# Define input and output file paths
input_file = '../cpsc583-project/data/global_food_prices_cad.csv'
output_file = 'output.csv'

# Initialize a dictionary to store data
data_dict = {}

# Open the input file and read in the data
with open(input_file, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Extract the relevant data fields
        country_name = row['CountryName']
        city_name = row['CityName']
        mp_year = row['mp_year']
        mp_price = row['mp_price']
        food_name = row['FoodName']

        # Add the data to the dictionary
        if (country_name, city_name, mp_year) not in data_dict:
            data_dict[(country_name, city_name, mp_year)] = {}
        data_dict[(country_name, city_name, mp_year)][food_name] = row[food_name]

# Create a list of headers
headers = ['CountryName', 'CityName', 'mp_year', 'mp_price']
headers.extend(sorted(set([food_name for (_, _, _), food_dict in data_dict.items() for food_name in food_dict.keys()])))

# Open the output file and write the headers
with open(output_file, 'w') as f:
    writer = csv.writer(f)
    writer.writerow(headers)

    # Write the data
    for (country_name, city_name, mp_year), food_dict in data_dict.items():
        row = [country_name, city_name, mp_year, mp_price]
        row.extend([food_dict.get(food_name, '') for food_name in headers[4:]])
        writer.writerow(row)

print("CSV file created successfully!")
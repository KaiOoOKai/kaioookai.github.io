import csv

rows = []

# Open the first CSV file
with open('../data/subset_data/city_locations.csv', 'r') as cities_file:
    cities_reader = csv.reader(cities_file)

    # Skip the header row
    next(cities_reader)

    # Open the second CSV file
    with open('../data/global_food_prices.csv', 'r') as countries_file:
        countries_reader = csv.reader(countries_file)

        # Create a dictionary of cities and their corresponding countries
        cities_to_countries = {}
        for country_row in countries_reader:
            country_name = country_row[1]
            city_name = country_row[5] 
            cities_to_countries[city_name] = country_name

        print(cities_to_countries)
        
        # Determine the country for each city in the first CSV file
        for city_row in cities_reader:
            city_name = city_row[0]

            # Look up the country name using the dictionary of cities to countries
            country_name = cities_to_countries.get(city_name, 'Unknown')
            city_row.append(country_name)
            rows.append(city_row)
            print(f"The city {city_name} is in {country_name}")
        
# Write the updated data to a new CSV file
with open('output_file.csv', mode='w', newline='') as output_file:
    writer = csv.writer(output_file)
    # Write the header row with the new column
    writer.writerow(["CountryName", "CityName", "Latitude" , "Longitude"])
    # Write the rows with the new column
    writer.writerows(rows)
    
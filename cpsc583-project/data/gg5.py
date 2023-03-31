import csv

with open('food_price_updated.csv') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    cities = set()
    for row in csv_reader:
        city = (row['CountryName'], row['CityName'])
        cities.add(city)

with open('cities.csv', mode='w') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(['CountryName', 'CityName'])
    for city in cities:
        writer.writerow(city)
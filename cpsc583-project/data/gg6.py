import csv

data = {}

with open('cities.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        country = row['CountryName']
        city = row['CityName']
        if country in data:
            data[country].append(city)
        else:
            data[country] = [city]

with open('cities.js', 'w') as jsfile:
    jsfile.write('const cities = {\n')
    for country, cities in data.items():
        jsfile.write(f'  "{country}": {json.dumps(cities)},\n')
    jsfile.write('};')
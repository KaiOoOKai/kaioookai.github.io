import csv
# Import the required library
from geopy.geocoders import Nominatim

def get_all_cities(csv_file_path):
    unique_cities = set()

    with open(csv_file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            unique_cities.add((row["CityID"], row["CityName"]))

    return unique_cities

cities = get_all_cities('../sources/outfile4.csv')
print(len(cities))


# Initialize Nominatim API
geolocator = Nominatim(user_agent="MyApp")

location = geolocator.geocode("Hyderabad")

print("The latitude of the location is: ", location.latitude)
print("The longitude of the location is: ", location.longitude)

# list_of_countries = list(countries)

# def count_unique_markets(csv_file_path, country_id):
#     market_total = set()
#     with open(csv_file_path, 'r') as csv_file:
#         csv_reader = csv.DictReader(csv_file)
#         for row in csv_reader:
#             if float(row["CountryId"]) == country_id:
#             # if float(row["CountryId"]) == 8.0:
#                 market_total.add((row["CityID"]))

#     # print(len(market_total))
#     return len(market_total)

# num_markets = count_unique_markets('../sources/outfile4.csv', 115.0)

# data = set()
# list_of_data = list(data)

# for country in countries:
#     num_markets = count_unique_markets('../sources/outfile4.csv', float(country[0]))
#     data.add((country[0], country[1], num_markets))


# # print(data)
# ######################################
# # Hardcoded since it wasn't working lol 
# list_of_data = {('106.0', 'Guinea', 15), ('239.0', 'Tajikistan', 11), ('145.0', 'Libya', 39), ('257.0', 'United Republic of Tanzania', 26), ('45.0', 'Cameroon', 18), ('70.0', 'Djibouti', 5), ('159.0', 'Mauritania', 33), ('130.0', 'Jordan', 13), ('8.0', 'Angola', 2), ('182.0', 'Nigeria', 35), ('205.0', 'Rwanda', 97), ('4.0', 'Algeria', 7), ('108.0', 'Haiti', 9), ('271.0', 'Zimbabwe', 123), ('253.0', 'Uganda', 16), ('231.0', 'Sri Lanka', 2), ('152.0', 'Malawi', 116), ('254.0', 'Ukraine', 26), ('170.0', 'Mozambique', 22), ('126.0', 'Japan', 2), ('238.0', 'Syrian Arab Republic', 76), ('150.0', 'Madagascar', 22), ('191.0', 'Panama', 1), ('171.0', 'Myanmar', 159), ('188.0', 'Pakistan', 5), ('77.0', 'Eritrea', 1), ('180.0', 'Nicaragua', 3), ('235.0', 'Swaziland', 5), ('196.0', 'Philippines', 101), ('155.0', 'Mali', 52), ('105.0', 'Guinea-Bissau', 43), ('59.0', 'Congo', 11), ('19.0', 'Azerbaijan', 1), ('50.0', 'Chad', 4), ('103.0', 'Guatemala', 1), ('43.0', 'Burundi', 68), ('1.0', 'Afghanistan', 40), ('999.0', 'State of Palestine', 11), ('195.0', 'Peru', 1), ('12.0', 'Argentina', 1), ('132.0', 'Kazakhstan', 4), ('138.0', 'Kyrgyzstan', 34), ('70001.0', 'South Sudan', 20), ('68.0', 'Democratic Republic of the Congo', 80), ('33.0', 'Bolivia', 9), ('90.0', 'Gambia', 28), ('142.0', 'Lesotho', 10), ('175.0', 'Nepal', 25), ('116.0', 'Indonesia', 204), ('29.0', 'Benin', 50), ('133.0', 'Kenya', 27), ('118.0', 'Iraq', 18), ('249.0', 'Turkey', 4), ('13.0', 'Armenia', 13), ('79.0', 'Ethiopia', 78), ('115.0', 'Bassas da India', 158), ('181.0', 'Niger', 15), ('221.0', 'Sierra Leone', 13), ('141.0', 'Lebanon', 26), ('139.0', "Lao People's Democratic Republic", 17), ('49.0', 'Central African Republic', 32), ('117.0', 'Iran  (Islamic Republic of)', 1), ('269.0', 'Yemen', 24), ('72.0', 'Dominican Republic', 2), ('40764.0', 'Sudan', 10), ('44.0', 'Cambodia', 52), ('40765.0', 'Egypt', 1), ('167.0', 'Mongolia', 5), ('66.0', "Cote d'Ivoire", 12), ('165.0', 'Moldova Republic of', 2), ('172.0', 'Namibia', 8), ('226.0', 'Somalia', 24), ('23.0', 'Bangladesh', 1), ('94.0', 'Ghana', 19), ('26.0', 'Belarus', 1)}

# '''
#     Create a new CSV file with the market information
# '''
# header = ['CountryId', 'CountryName', 'NumOfMarkets']

# with open('num_markets.csv', 'w', newline = '') as file:
#     writer = csv.writer(file)
#     writer.writerow(header)
#     for row in list_of_data:
#         writer.writerow(row)

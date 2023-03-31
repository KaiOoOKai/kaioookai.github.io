# import csv

# def get_all_cities(csv_file_path):
#     unique_cities = set()

#     with open(csv_file_path, 'r') as csv_file:
#         csv_reader = csv.DictReader(csv_file)
#         for row in csv_reader:
#             unique_cities.add((row["CityID"], row["CityName"]))

#     return unique_cities

import pandas as pd

# read CSV file into a pandas dataframe
df = pd.read_csv('../data/global_food_prices.csv')

# group dataframe by key value and calculate average of selected rows
grouped_df = df.groupby('Badakhshan')[['row1', 'row2', 'row3']].mean()

# print the resulting dataframe
print(grouped_df)
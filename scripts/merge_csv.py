import pandas as pd

# Read the first CSV file
df1 = pd.read_csv('../data/subset_data/city_locations.csv')

# Read the second CSV file
df2 = pd.read_csv('../data/subset_data/city_prices.csv')

# Merge the two dataframes by city name
merged_df = pd.merge(df1, df2, on='CityName')

# Write the merged dataframe to a new CSV file
merged_df.to_csv('merged.csv', index=False)
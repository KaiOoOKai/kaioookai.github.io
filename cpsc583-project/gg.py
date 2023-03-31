import pandas as pd
import random

# read the CSV file
df = pd.read_csv('data/global_food_prices_cad.csv')

# create a pivot table with CityName, mp_year, and FoodName as the index
# and mp_price as the values
pivot_df = pd.pivot_table(df, index=['CityName', 'mp_year'], columns='FoodName', values='mp_price')

# fill missing values with a random number between 0 and 1
for col in pivot_df.columns:
    pivot_df[col].fillna(random.uniform(0, 1), inplace=True)

# reset the index and rename the columns
pivot_df = pivot_df.reset_index()
pivot_df.columns.name = None

# save the result as a new CSV file
pivot_df.to_csv('result.csv', index=False)
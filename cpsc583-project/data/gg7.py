import pandas as pd

# Define input and output file paths
input_file = 'global_food_prices_cad.csv'
output_file = 'output.csv'

# Read input file into a pandas DataFrame
df = pd.read_csv(input_file)

# Pivot the DataFrame to create a wide format with FoodName as columns
df_pivot = df.pivot_table(index=['CountryName', 'CityName', 'mp_year'], 
                          columns='FoodName', 
                          values='mp_price', 
                          fill_value='')

# Reset the index to make the index columns into regular columns
df_pivot = df_pivot.reset_index()

# Create a list of headers
headers = ['CountryName', 'CityName', 'mp_year', *df_pivot.columns[3:]]

# Write output DataFrame to CSV file
df_pivot.to_csv(output_file, index=False, columns=headers)

print("CSV file created successfully!")
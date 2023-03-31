import pandas as pd
import numpy as np

# read the CSV file
data = pd.read_csv('outfile.csv')

# add missing years
for city_food, group in data.groupby(['CityName', 'FoodName']):
    for year in range(2003, 2022):
        if year not in group['mp_year'].values:
            maxprice = group['mp_price'].max();
            minprice = group['mp_price'].min();
            if (maxprice == minprice):
                maxprice = maxprice * 1.3
                minprice = minprice * 0.7
            rand_num = np.random.uniform(minprice, maxprice)
            prev_year = group.sort_values('mp_year', ascending=False)
            if not prev_year.empty:
                prev_year = prev_year.iloc[0]
                data = data.append(prev_year, ignore_index=True)
                data.loc[data.index[-1], 'mp_year'] = year
                # print(f"ssssssssssssssssssssssssssssssssssssssssssssss{rand_num}" )
                data.loc[data.index[-1], 'mp_price'] = rand_num
                # print(data.index[-1])

# save the updated data to a new CSV file
data.to_csv('food_price_updated3.csv', index=False)
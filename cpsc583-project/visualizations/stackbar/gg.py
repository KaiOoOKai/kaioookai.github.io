import pandas as pd
import random

# read csv file into a pandas DataFrame
df = pd.read_csv('small.csv')

# fill in missing values with random numbers between 0 and 5
df = df.apply(lambda x: x.fillna(random.uniform(0, 5)) if x.dtype.kind in 'f' else x)

# write result to a new csv file
df.to_csv('new_filename.csv', index=False)
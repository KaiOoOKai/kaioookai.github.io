import pandas as pd

# read the CSV file into a pandas dataframe
df = pd.read_csv('output.csv')

# remove duplicate rows
df.drop_duplicates(inplace=True)

# save the dataframe back to a CSV file
df.to_csv('filename_without_duplicates.csv', index=False)
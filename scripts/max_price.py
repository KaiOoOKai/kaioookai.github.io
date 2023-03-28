import csv

# Open the CSV file
with open('merged.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    # Specify the column to find the max value for
    column_name = 'AvgPrice'
    
    # Use a generator expression with the max function to find the max value in the column
    # error
    max_value = max(float(row[column_name]) for row in csv_reader)
    
    # Print the max value
    print('Max value in column', column_name, ':', max_value)
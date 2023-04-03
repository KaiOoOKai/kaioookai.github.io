import csv
import random

# Open the input and output CSV files
with open('food_prices_avg.csv', 'r') as csv_file, open('output.csv', 'w', newline='') as output_file:
    # Create CSV reader and writer objects
    csv_reader = csv.reader(csv_file)
    csv_writer = csv.writer(output_file)

    # Skip over the first row of the CSV file
    next(csv_reader)

    # Loop through each row in the CSV file
    for row in csv_reader:
        # Loop through each field in the row
        for i in range(len(row)):
            # Get the value of the current field
            value = row[i]
            if(i >= 1):
                if (i == (len(row)-1)):
                    new_value = value
                    continue
                # Add a random float number from -1 to 1 to the value
                temp_value = float(value) + random.uniform(-1, 1)
                if (temp_value < 0):
                    new_value = 0 - temp_value 
                else:
                    new_value = temp_value
                
            else:
                new_value = value
            # Update the value of the current field
            row[i] = new_value
            
        # Write the updated row to the output CSV file
        csv_writer.writerow(row)

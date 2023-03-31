import csv

filter = {}
lines = open('global_food_prices.csv', 'r').readlines()
fout = open ('countries.txt','w')
writer = csv.writer(fout)
columns = lines[0].strip().split(',')
countries = set()
lines.pop(0)

for i in lines:
    x = i.strip().split(',')
    if x[columns.index('cm_name')] not in countries:
        writer.writerow("".join(x[columns.index('cm_name')]))
        countries.add(x[columns.index('cm_name')]) 
import csv

filter = ['Bread - Retail', 'Rice (low quality) - Retail', 'Rice (high quality) - Retail',
 'Meat (chicken) - Retail', 'Eggs - Retail', 'Milk - Retail', 'Meat (beef) - Retail',
 'Meat (pork) - Retail', 'Meat (lamb) - Retail','Fish (frozen) - Retail', 'Carrots - Retail', 
 'Onions - Retail', 'Potatoes - Retail', 'Beans - Retail', 'Salt - Retail',
 'Apples (red) - Retail', 'Tomatoes - Retail', 'Oranges - Retail', 'Wheat - Retail',
 'Bread (wheat) - Retail', 'Oil (vegetable) - Retail', 'Oil (sunflower) - Retail', 
 'Sugar (white) - Retail', 'Cabbage - Retail', 'Garlic - Retail', 'Sugar (local) - Retail', 
 'Pasta - Retail', 'Cucumbers - Retail', 'Wheat flour (first grade) - Retail', 
 'Walnuts - Retail', 'Peas - Retail', 'Tea (black) - Retail']
lines = open('global_food_prices.csv', 'r').readlines()
fout = open ('outfile.csv','w', newline='', encoding='utf-8')
writer = csv.writer(fout, delimiter=',')
columns = lines[0].strip().split(',')

lines.pop(0)

for i in lines:
    x = i.strip().split(',')
    if x[columns.index('mp_year')].isdigit():
        if int(x[columns.index('mp_year')]) > 2003:
            if x[columns.index('mp_month')].isdigit():
                 if int(x[columns.index('mp_month')]) == 1:
                    if(x[columns.index('cm_name')] in filter):
                        writer.writerow(x)
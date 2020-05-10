#!/bin/python3

from datetime import datetime
from sys import argv
from os.path import isfile
from os import rename


if len(argv) > 2:
    print('too much arguments')
    exit(1)
elif len(argv) == 2:
    name = argv[1]
else:
    print('Enter post name:')
    name = input()

if name.find('_') != -1:
    print("Name cannot contain '_' symbol")
    exit(2)

now = datetime.now()
filename = '{:04}_{:02}_{:02}_{}'.format(now.year, now.month, now.day, name.lower().replace(' ', '_'))
print('Going to create file', filename)

filepath = 'public/posts/' + filename + '.md'
if isfile(filepath):
    print('Filename already exists, still proceed? y/N')
    yn = input().lower()

    if yn != 'y' and yn != 'yes':
        exit(3)
    else:
        rename(filepath, filepath + '.bak')


with open(filepath, 'w+') as f:
    f.write('# {}\n\nLorem ipsum'.format(name))

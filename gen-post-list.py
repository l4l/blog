#!/bin/python3

from os import listdir

files = listdir('./public/posts')

with open('src/posts.js', 'w+') as f:
    f.write('const posts = [{}]\n\nexport default posts\n'
        .format(', '.join(["'" + f[:f.rfind('.md')] + "'" for f in files])))

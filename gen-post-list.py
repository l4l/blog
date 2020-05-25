#!/bin/python3

from os import listdir, stat
from datetime import datetime
import rfeed

POSTS_PATH = './public/posts/'
POSTS_SUFFIX = '.md'

files = [f[:f.rfind(POSTS_SUFFIX)] for f in listdir(POSTS_PATH)]

with open('src/posts.js', 'w+') as f:
    f.write('const posts = [{}]\n\nexport default posts\n'
        .format(', '.join(["'{}'".format(f) for f in files])))

def make_item(file):
    with open(POSTS_PATH + file + POSTS_SUFFIX, 'r') as f:
        pubDate = f.readline()[5:24]

    return rfeed.Item(
        title = file[11:].replace('_', ' ').title(),
        link = 'https://kitsu.me/#/posts/' + file,
        guid = rfeed.Guid('https://kitsu.me/#/posts/' + file),
        pubDate = datetime.strptime(pubDate, '%Y/%m/%d %H:%M:%S') ,
    )

feed = rfeed.Feed(
    title = "kitsu's blog",
    link = 'https://kitsu.me/feed.xml',
    description = "kitsu's personal blog",
    lastBuildDate = datetime.now(),
    items = [make_item(f) for f in files]
)

with open('./public/feed.xml', 'w+') as f:
    f.write(feed.rss())

#!/bin/python3

from datetime import datetime
from sys import argv
from os import rename, path, listdir

DRAFT_PATH = 'draft/'
POST_PATH = 'public/posts/'


def post_filename(name):
    assert name.find('_') == -1
    return name.lower().replace(' ', '_') + '.md'


def create_draft(name):
    filepath = DRAFT_PATH + post_filename(name)

    if path.exists(filepath):
        print('Filename already exists, still proceed? y/N')
        yn = input().lower()

        if yn != 'y' and yn != 'yes':
            exit(3)
        else:
            rename(filepath, filepath + '.bak')

    with open(filepath, 'w+') as f:
        f.write('# {}\n\nLorem ipsum'.format(name))


def publish(name):
    draft_path = DRAFT_PATH + post_filename(name)

    if not path.exists(draft_path):
        print('Draft `{}` does not exist'.format(name))
        exit(4)

    for item in listdir(POST_PATH):
        if item.find(post_filename(name)) != -1:
            print('Post `{}` already published as {}'.format(name, item))
            exit(4)

    now = datetime.now()
    filename = POST_PATH + now.strftime('%Y_%m_%d_') + post_filename(name)
    rename(draft_path, filename)

    with open(filename, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write('<!-- {} -->\n{}'.format(now.strftime('%Y/%m/%d %H:%M:%S'), content))


USAGE = 'Usage: {} (draft|publish) <post-name>'.format(argv[0])

if len(argv) != 3:
    print(USAGE)
    exit(1)

cmd = argv[1]
name = argv[2]

if name.find('_') != -1:
    print("Name cannot contain '_' symbol")
    exit(2)

if cmd == 'draft':
    create_draft(name)
elif cmd == 'publish':
    publish(name)
else:
    print('Unknown command')
    print(USAGE)
    exit(1)

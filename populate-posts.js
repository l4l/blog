const Feed = require('feed').Feed;
const fs = require('fs');
const strptime = require('micro-strptime').strptime;

const postsPath = 'public/_posts/'
const postFormat = /^([0-9]+)_([0-9]+)_([0-9]+)_(?<name>.*)$/


async function find_posts() {
    var posts = []
    const dir = await fs.promises.opendir(postsPath)
    for await (const dirent of dir) {
        posts.push(dirent.name)
    }
    return posts.map((p) => p.replace(/\.md$/, ''))
}

async function gen_post_list(posts) {
    const file = await fs.promises.open('src/posts.js', 'w+')
    file.write('const posts = [' + posts.map((p) => `'${p.replace(/\.md$/, '')}'`).join(', ') + ']\n')
    file.write('export default posts\n')
}

async function gen_rss(posts) {
    var feed = new Feed({
        title: "kitsu's blog",
        description: "kitsu's personal blog",
        id: 'https://kitsu.me/',
        link: 'https://kitsu.me/',
        language: "en",
        updated: new Date(),
    });

    for (post of posts) {
        const name = postFormat.exec(post).groups.name.split('_').map((x) => {
            return x[0].toUpperCase() + x.substr(1)
        }).join(' ')

        const pubDate = fs.readFileSync(postsPath + post + '.md', 'utf8').slice(5, 24)

        feed.addItem({
            title: name,
            id: 'https://kitsu.me/posts/' + post,
            link: 'https://kitsu.me/posts/' + post,
            date: strptime(pubDate, '%Y/%m/%d %H:%M:%S') ,
        })
    }

    fs.writeFileSync('public/feed.xml', feed.rss2())
    fs.writeFileSync('public/atom.xml', feed.atom1())
}

find_posts()
    .then((posts) => {
        gen_post_list(posts)
        gen_rss(posts)
    })

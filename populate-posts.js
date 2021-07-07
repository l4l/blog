const Feed = require('feed').Feed;
const fs = require('fs');
const fm = require('front-matter');

const postsPath = 'articles/'


async function find_posts() {
    var posts = []
    const dir = await fs.promises.opendir(postsPath)
    for await (const dirent of dir) {
        const path = dirent.name
        const data = fs.readFileSync(postsPath + path, 'utf8')
        const content = fm(data)

        posts.push({
            post_path: path,
            post_url: path.replace(/\.md$/, ''),
            meta: content.attributes
        })
    }
    return posts;
}

async function gen_post_list(posts) {
    const file = await fs.promises.open('assets/posts.js', 'w+')
    file.write('const posts = [' + posts.map((p) => `\n  '${p.post_url}'`).join(',') + '\n]\n')
    file.write('export default posts\n')
}

async function gen_post_pages(posts) {
    for (post of posts) {
        var meta = []
        var make_meta = (val, x) => ({ hid: `${val}`, property: `${val}`, content: x })

        meta.push(make_meta('og:type', 'article'))
        meta.push(make_meta('article:published_time', post.meta.pubDate))
        meta.push(make_meta('article:author', 'Eugene Minibaev'))
        meta.push(make_meta('og:title', post.meta['title']))
        if ('description' in post.meta) {
            meta.push(make_meta('og:description', post.meta['description']))
            meta.push(make_meta('description', post.meta['description']))
        }
        if ('image' in post.meta) {
            meta.push(make_meta('og:image', post.meta['image']))
        }

        const fileContent = `<template lang="pug">
Post(:post="Content")/
</template>

<script>
import Post from '~/components/post'
import Data from '~/articles/${post.post_path}'

export default {
  components: {
    Post,
  },
  head() {
      return {
        meta: [
            ${meta.map((m) => JSON.stringify(m)).join(',\n            ')}
        ],
      }
  },
  data: () => ({
    Content: Data.vue.component
  })
}
</script>
`
        fs.writeFileSync(`pages/posts/${post.post_url}.vue`, fileContent)
    }
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
        feed.addItem({
            title: post.meta.title,
            id: 'https://kitsu.me/posts/' + post.post_url,
            link: 'https://kitsu.me/posts/' + post.post_url,
            date: post.meta.pubDate,
        })
    }

    fs.writeFileSync('static/feed.xml', feed.rss2())
    fs.writeFileSync('static/atom.xml', feed.atom1())
}

find_posts()
    .then((posts) => {
        gen_post_list(posts)
        gen_post_pages(posts)
        gen_rss(posts)
    })

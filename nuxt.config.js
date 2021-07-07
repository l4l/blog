import FMMode from 'frontmatter-markdown-loader/mode'
import path from 'path'

export default {
  head: {
    title: 'kitsu\'s blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:title', property: 'og:title', content: 'kitsu\'s blog' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:image', property: 'og:image', content: '/141.jpg' },
      { hid: 'og:url', property: 'og:url', content: process.env.VERCEL_URL },
      { hid: 'og:locale', property: 'og:locale', content: 'en' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [],
  plugins: [
    { src: '~/plugins/prism', mode: 'client' }
  ],
  components: false,
  buildModules: [],
  build: {
    extend (config, _ctx) {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'frontmatter-markdown-loader',
          include: path.resolve(__dirname, 'articles'),
          options: {
            mode: [FMMode.VUE_COMPONENT],
            vue: {
              root: 'markdown-body'
            }
          }
        }
      )
    }
  }
}

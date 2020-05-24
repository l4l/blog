<template lang="pug">
div.post-container
  div.post(v-if="isPage()")
    button(v-on:click="backToList")
      img(src="icons/back.svg")
    article(v-html="pageContent")
  div.listing(v-else)
    template(v-for="(post, index) in parsedPosts()")
      a(:id="post.filename",
        v-on:click="openPage").post
        span.post-date {{post.year}}-{{post.month}}-{{post.day}}
        span.post-title {{post.prettyName}}
      div.divider(v-if="customData.length - 1 !== index")
</template>

<script>
import Vue from 'vue'
import marked from 'marked'
import hljs from '@/highlighter.config'

marked.setOptions({
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    return hljs.highlight(validLanguage, code).value
  }
})

const postFormat = /(?<year>[0-9]+)_(?<month>[0-9]+)_(?<day>[0-9]+)_(?<name>.*)/

export default Vue.extend({
  name: 'Blog',
  props: ['customData'],
  data: function () {
    const page = this.$route.params.name
    if (page !== undefined) {
      this.renderPage(page)
    }
    return {
      page,
      pageContent: ''
    }
  },
  methods: {
    openPage: function (event) {
      this.page = event.currentTarget.id
      this.renderPage(this.page)
      this.$router.push({ path: '/posts/' + this.page })
    },
    isPage: function () {
      return this.page !== undefined
    },
    unsertPage: function () {
      this.page = undefined
    },
    backToList: function () {
      this.unsertPage()
      this.$router.push({ path: '/posts' })
    },
    renderPage: function (page) {
      const xmlHttp = new XMLHttpRequest()
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          this.pageContent = marked(xmlHttp.responseText)
        } else if (xmlHttp.status <= 599 && xmlHttp.status >= 400) {
          this.pageContent = 'Post unavailable (code ' +
            xmlHttp.status +
            '), sorry. Please write me down so I can fix it up.'
        } else {
          this.pageContent = 'Unknown page'
        }
      }
      this.$nextTick()
      xmlHttp.open('GET', './posts/' + page + '.md', true)
      xmlHttp.send(null)
    },
    parsedPosts: function () {
      const processed = this.customData.map(function (item) {
        const group = postFormat.exec(item).groups
        if (group !== undefined) {
          group.prettyName = group.name.replace(/_/g, ' ').replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
          group.filename = item
        }
        return group
      })

      processed.sort((a, b) => {
        const yearCmp = b.year - a.year
        const monthCmp = b.month - a.month
        const dayCmp = b.day - a.day
        const nameCmp = b.name - a.name
        return yearCmp || monthCmp || dayCmp || nameCmp
      })

      return processed
    }
  },
  watch: {
    $route (to) {
      if (to.path === '/posts') {
        this.unsertPage()
      }
    }
  }
})
</script>

<style scoped>
div.post-container {
  margin: 5% auto;
  width: 60%;
  min-width: 400px;
  max-width: 800px;
}

div.post button {
  position: absolute;
  left: 50px;
  top: 50px;
  border: none;
  background: transparent;
  height: auto;
}

a.post {
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: black;
  padding: 10px;
}

div.divider {
  margin: 20px auto;
  width: 100%;
  height: 1px;
  background-color: #ddd;
}

span.post-date {
  min-width: 50px;
  margin-right: 25%;
  margin-top: auto;
  margin-bottom: auto;
  height: 100%;
  text-align: left;
}

span.post-title {
  max-width: 400px;
  word-wrap: all;
}

div.post {
  overflow: hidden;
  background: #ddd;
  padding: 15px;
  box-shadow: -1px 1px 10px black;
}
</style>

<style>
code {
  display: block;
  background: #eee;
  box-shadow: -1px 1px 3px #aaa;
  padding: 5px;
  border-radius: 3px;
  font-family: "Fira Code", Courier, monospace;
  font-size: 14px;
  overflow: auto;
}

p > code {
  display: inline;
  padding: 0 3px;
}
</style>

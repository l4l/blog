<template lang="pug">
div.post
  article
    component(:is="post")
  button(v-on:click="backToList")
    img(src="/icons/back.svg")
</template>

<script>
import Prism from '~/plugins/prism'

function makePrettyName(name) {
  return name.replace(/_/g, ' ').replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export default {
  props: ["post"],
  mounted() {
    document.title += ' :: ' + makePrettyName(document.URL.replace(/.*\/\d+_\d+_\d+_/, ''))
    Prism.highlightAll()
  },
  methods: {
    backToList: function () {
      document.title = document.title.replace(/ :: .*/, '')
      this.$router.push({ path: '/posts' })
    }
  }
}
</script>

<style>
div.post {
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

div.post {
  overflow: hidden;
  background: #ddd;
  padding: 15px;
  box-shadow: -1px 1px 10px black;
}

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

p > code, p > a > code {
  display: inline;
  padding: 0 3px;
}

article a {
  text-decoration: none;
}

code {
  box-shadow: none !important;
}
</style>

<template lang="pug">
div.listing
  div(v-for="[index, post] of postNames.entries()")
    a(:id="post.filename",
      v-on:click="openPage").post
      span.post-date {{post.year}}-{{post.month}}-{{post.day}}
      span.post-title {{post.prettyName}}
    div.divider(v-if="postNames.length - 1 !== index")
</template>

<script>
import posts from '~/assets/posts'

const postFormat = /(?<year>[0-9]+)_(?<month>[0-9]+)_(?<day>[0-9]+)_(?<name>.*)/

function makePrettyName(name) {
  return name.replace(/_/g, ' ').replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

const processed = posts.map(function (item) {
  const group = postFormat.exec(item).groups
  if (group !== undefined) {
    group.prettyName = makePrettyName(group.name)
    group.filename = item
  }
  return group
});

processed.sort((a, b) => (b.year - a.year) || (b.month - a.month) || (b.day - a.day))

export default {
  data: function () {
    return {
      postNames: processed
    }
  },
  methods: {
    openPage: function (event) {
      console.log(event.target.id)
      this.$router.push({ path: '/posts/' + event.currentTarget.id })
    },
  }
}
</script>

<style>
div.listing {
  margin: 5% auto;
  width: 60%;
  min-width: 400px;
  max-width: 800px;
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
</style>

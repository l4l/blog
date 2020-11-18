<template lang="pug">
div.header
  p.header-separator
  div(style="inline-block", v-for='tab in headerTabs()')
    NuxtLink(v-if="tab.route != undefined", :to="tab.route")
      p.route(v-bind:key='tab.name',
              v-on:click='currentTab = tab')
        span {{tab.name}}
    span(v-else)
      p.route
        a.external-link(target="_blank", :href="tab.link") {{tab.name}}
</template>

<script>
const tabs = [
  {
    name: 'Blog',
    route: '/posts'
  },
  {
    name: 'Whoami',
    route: '/whoami'
  },
  {
    name: 'RSS',
    link: '/feed.xml'
  },
  {
    name: 'Report issue',
    link: 'https://github.com/l4l/l4l.github.io/issues/new'
  }
]

export default {
  data: function() {
    return {
      tabs,
      currentTab: undefined
    }
  },
  methods: {
    headerTabs: function () {
      return this.tabs.filter((x) => x.name !== undefined)
    },
  }
}
</script>

<style>
div.header {
  margin-top: 30px;
  padding: 0 2%;
  width: 96%;
  display: table;
}

div.header p.header-separator {
  width: 90%;
}

div.header p.route {
  cursor: pointer;
}

div.header > * {
  display: table-cell;
  padding-left: 20px;
  font-size: small;
  white-space: nowrap;
  color: gray;
}

a {
  text-decoration: none;
  color: gray;
}
</style>

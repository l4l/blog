<template lang="pug">
div#app
  div.header
    p.header-separator
    div(style="inline-block", v-for='tab in headerTabs()')
      router-link.route-link(v-if="tab.route != undefined", :to="tab.route")
        p.route(v-bind:key='tab.name',
                v-on:click='currentTab = tab')
          span {{tab.name}}
      span(v-else)
        p.route
          a.external-link(target="_blank", :href="tab.link") {{tab.name}}
  div.main
    transition(name="fade", mode="out-in")
      component(v-bind:is="currentTab.component",
                v-bind:customData="currentTab.customData")
  div.footer
    div.icons
      div.contact-icon(v-for="contact in contacts")
        a(:href="contact.href",
          :onmouseover="contact.textOnmouseover")
          img(:src="contact.src")
    p {{ new Date().getFullYear() }} &bull; &copy;kitsu
</template>

<script>
import Vue from 'vue'

import Blog from './components/Blog.vue'
import Whoami from './components/Whoami.vue'
import posts from './posts'

const paragraphs = [
  'Hi there, my name is Eugene Minibaev, a.k.a kitsu. I am software engineer from Russia.',
  'My interests are low-level programming (networking, hardware interaction), programming languages, music and travel.',
  'Key: B9ED4CB4969F9BB454D229C0B279D7E828C278CD'
]

const contacts = [
  {
    href: 'mxilyo:mxil@kiysu.me',
    textOnmouseover: "this.href=this.href.replace(/x/g, 'a').replace(/y/g, 't')",
    src: '/icons/envelope.svg'
  },
  {
    href: 'https://github.com/l4l',
    src: '/icons/github.svg'
  },
  {
    href: 'https://telegram.me/kitsu',
    src: '/icons/telegram.svg'
  },
  {
    href: 'https://www.linkedin.com/in/kitsu/',
    src: '/icons/linkedin.svg'
  }
]

const tabs = [
  {
    name: 'Blog',
    component: Blog,
    customData: posts,
    route: '/posts'
  },
  {
    name: 'Whoami',
    component: Whoami,
    customData: paragraphs,
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

export default Vue.extend({
  name: 'App',
  data: function () {
    return {
      currentTab: this.currentTabFn(this.$route.path),
      tabs,
      contacts
    }
  },
  methods: {
    headerTabs: function () {
      return this.tabs.filter((x) => x.name !== undefined)
    },
    currentTabFn: function (path) {
      const tab = tabs.filter((x) => x.route !== undefined).find((x) => path.startsWith(x.route))
      const currentTab = tab === undefined ? tabs[0] : tab
      return currentTab
    }
  },
  watch: {
    $route (to) {
      this.$data.currentTab = this.currentTabFn(to.path)
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: justify;
  color: #2c3e50;
  height: 100%;
}

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

div.main {
  width: 80%;
  min-height: 400px;
  margin: 130px auto;
}

div.footer {
  margin-top: -10px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  bottom: 15px;
}

div.footer > p {
  text-align: center;
}

div.icons {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

div.icons img {
  width: 24px;
  margin-left: 7px;
  margin-right: 7px;
}

.route-link,a.external-link {
  text-decoration: none;
  color: gray;
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}

.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>

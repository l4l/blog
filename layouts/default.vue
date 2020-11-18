<template lang="pug">
div
  NavBar
  div.main
    Nuxt
  Footer
</template>

<script>
import NavBar from '~/components/navbar'
import Footer from '~/components/footer'

export default {
  components: {
    NavBar,
    Footer
  }
}
</script>

<style>
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: justify;
  color: #2c3e50;
  height: 100%;
}

div.main {
  width: 80%;
  min-height: 400px;
  margin: 130px auto;
}
</style>

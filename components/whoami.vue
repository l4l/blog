<template lang="pug">
div.block
  div.text
    p(v-for="paragraph in paragraphs") {{paragraph}}
  span
  img(src="~/assets/141.jpg").avatar
</template>

<script>
import Vue from 'vue'

const paragraphs = [
  'Hi there, my name is Eugene Minibaev, a.k.a kitsu. I am software engineer from Russia.',
  'My interests are low-level programming (networking, hardware interaction), programming languages, music and travel.',
  'Key: B9ED4CB4969F9BB454D229C0B279D7E828C278CD'
]

export default Vue.extend({
  name: 'Whoami',
  data: function() {
    return { paragraphs }
  }
})
</script>

<style scoped>
div.block {
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

div.text {
  width: 40%;
  max-width: 600px;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
}

div.block span {
  min-width: 1px;
}

img.avatar {
  margin-left: auto;
  /*margin-right: auto;*/
  width: 30%;
  max-width: 300px;
  height: auto;
}
</style>

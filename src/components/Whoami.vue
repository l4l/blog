<template lang="pug">
div.block
  div.text
    p(v-for="paragrap in customData") {{paragrap}}
  span
  img(src="../assets/141.jpg").avatar
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Whoami',
  props: ['customData']
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

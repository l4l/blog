<template lang="pug">
  div.footer
    div.icons
      div.contact-icon(v-for="contact in contacts")
        a(:href="contact.href",
          :onmouseover="contact.textOnmouseover")
          img(:src="contact.src")
    p {{ new Date().getFullYear() }} &bull; &copy;kitsu
</template>



<script>
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

export default {
  data: function() {
    return { contacts }
  }
}
</script>

<style>
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
</style>

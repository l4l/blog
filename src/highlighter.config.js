import hljs from 'highlight.js/lib/highlight'
import 'highlight.js/styles/gruvbox-light.css'

import rustmod from 'highlight.js/lib/languages/rust'
import pythonmod from 'highlight.js/lib/languages/python'
import bashmod from 'highlight.js/lib/languages/bash'

hljs.registerLanguage('rust', rustmod)
hljs.registerLanguage('python', pythonmod)
hljs.registerLanguage('bash', bashmod)

export default hljs

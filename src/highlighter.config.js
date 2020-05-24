import hljs from 'highlight.js/lib/highlight'
import 'highlight.js/styles/gruvbox-light.css'

import plaintextmod from 'highlight.js/lib/languages/plaintext'
import rustmod from 'highlight.js/lib/languages/rust'
import pythonmod from 'highlight.js/lib/languages/python'
import bashmod from 'highlight.js/lib/languages/bash'
import sqlmod from 'highlight.js/lib/languages/sql'
import tomlmod from 'highlight.js/lib/languages/ini'

hljs.registerLanguage('plaintext', plaintextmod)
hljs.registerLanguage('rust', rustmod)
hljs.registerLanguage('python', pythonmod)
hljs.registerLanguage('bash', bashmod)
hljs.registerLanguage('sql', sqlmod)
hljs.registerLanguage('toml', tomlmod)

export default hljs

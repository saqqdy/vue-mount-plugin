index.md - v2.1.1 / [Exports](modules.md)

<div style="text-align: center;" align="center">

# vue-mount-plugin

A simple and easy to use vue instance extension plugin that supports vue2.0 and vue3.0

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

## **For API documentation, see: [API Docs](./docs/modules.md)**

</div>

## Installing

```bash
# use pnpm
$ pnpm install vue-mount-plugin

# use npm
$ npm install vue-mount-plugin --save

# use yarn
$ yarn add vue-mount-plugin
```

## Usage

### Use in Vue `>=3.0`

```vue
<!-- test.vue -->
<script setup>
import { getCurrentInstance } from 'vue'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

const { proxy } = getCurrentInstance()
const instance = new Mount(DemoVue, { parent: proxy.$root })

// mount to the end of document.body
instance.mount()

// unmount
instance.unmount()
</script>
```

### Use in Vue `2.7`

```vue
<!-- test.vue -->
<script>
import { getCurrentInstance } from 'vue'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const instance = new Mount(DemoVue, { parent: proxy.$root })

    // mount to the end of document.body
    instance.mount()

    // unmount
    instance.unmount()
  }
}
</script>
```

### Use in Vue `<=2.6`

> Add `@vue/composition-api` to the `project.json` dependencies and run install.

```json
{
  "dependencies": {
    "@vue/composition-api": "latest"
  }
}
```

```vue
<!-- test.vue -->
<script>
import { getCurrentInstance } from '@vue/composition-api'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const instance = new Mount(DemoVue, { parent: proxy.$root })

    // mount to the end of document.body
    instance.mount()

    // unmount
    instance.unmount()
  }
}
</script>
```

### Import in Browser

Import `vue-mount-plugin` through browser HTML tags directly, and use global variable VueMount.

```html
<head>
  <!-- Import vue3 or vue2 -->
  <script src="//unpkg.com/vue@3"></script>
  <!-- Import vue-demi library -->
  <script src="//unpkg.com/vue-demi"></script>
  <!-- Import vue-mount-plugin library -->
  <script src="//unpkg.com/vue-mount-plugin"></script>
</head>
```

```vue
<!-- test.vue -->
<script>
import { getCurrentInstance } from '@vue/composition-api'
import DemoVue from './demo.vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const instance = new VueMount(DemoVue, { parent: proxy.$root })

    // mount to the end of document.body
    instance.mount()

    // unmount
    instance.unmount()
  }
}
</script>
```

## Support & Issues

Please open an issue [here](https://github.com/saqqdy/vue-mount-plugin/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/vue-mount-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/vue-mount-plugin
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/vue-mount-plugin/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/vue-mount-plugin&utm_campaign=Badge_Grade
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/vue-mount-plugin.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/vue-mount-plugin?branch=master
[download-image]: https://img.shields.io/npm/dm/vue-mount-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/vue-mount-plugin
[gzip-image]: http://img.badgesize.io/https://unpkg.com/vue-mount-plugin/dist/index.iife.min.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/vue-mount-plugin/dist/index.iife.min.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_vue-mount-plugin
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_vue-mount-plugin

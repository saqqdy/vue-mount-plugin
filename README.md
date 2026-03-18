<div style="text-align: center;" align="center">

# vue-mount-plugin

A simple and easy to use Vue instance extension plugin that supports Vue 2.0 and Vue 3.0

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

**[Changelog](./CHANGELOG.md)** • **[中文文档](./README_CN.md)**

</div>

## Quick Try

Try it online with StackBlitz:

| Framework | Link |
| --------- | ---- |
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue2) |

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

> Add `@vue/composition-api` to the `package.json` dependencies and run install.

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

Import `vue-mount-plugin` through browser HTML tags directly, and use global variable `VueMount`.

```html
<head>
  <!-- Import vue3 or vue2 -->
  <script src="//unpkg.com/vue@3"></script>
  <!-- Import vue-mount-plugin library -->
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
</head>
```

```html
<script>
  const instance = new VueMount(DemoVue, { parent: this.$root })

  // mount to the end of document.body
  instance.mount()

  // unmount
  instance.unmount()
</script>
```

### ES5 Support

For older browsers (IE11), use the ES5 build:

```html
<head>
  <!-- Import vue2 (Vue 3 does not support IE11) -->
  <script src="//unpkg.com/vue@2"></script>
  <!-- Import vue-mount-plugin ES5 build -->
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.es5.min.js"></script>
</head>
```

## API

### Constructor

```typescript
new Mount(component, options?)
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `component` | `Component` | Vue component to mount (supports async components) |
| `options` | `Options` | Mount options (optional) |

#### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `app` | `App` | - | Vue 3 app instance |
| `children` | `unknown` | - | Children for VNode |
| `context` | `object` | - | Vue 2 context (router, store, i18n) |
| `parent` | `unknown` | - | Parent component instance |
| `props` | `object` | - | Props to pass to component |
| `target` | `Element \| string` | - | Mount target element or selector |
| `tagName` | `string` | `'div'` | Tag name for auto-created container |
| `listeners` | `Listeners` | - | Event listeners object |
| `on` | `Listeners` | - | Event listeners (alias) |
| `slots` | `Slots` | - | Slots object |
| `ref` | `Ref` | - | Ref to get component instance |
| `keepAlive` | `KeepAliveOptions \| boolean` | - | KeepAlive configuration |

#### Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `onBeforeMount` | Called before component is mounted |
| `onMounted` | Called after component is mounted |
| `onBeforeUnmount` | Called before component is unmounted |
| `onUnmounted` | Called after component is unmounted |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `mount()` | `this` | Mount the component to DOM |
| `unmount()` | `void` | Unmount and destroy the component |
| `destroy()` | `void` | Alias for `unmount()` |
| `remove()` | `void` | Alias for `unmount()` |
| `setProps(props)` | `this` | Set props (chainable) |
| `setListeners(listeners)` | `this` | Set event listeners (chainable) |
| `on(listeners)` | `this` | Alias for `setListeners()` |
| `setSlots(slots)` | `this` | Set slots (chainable) |
| `setTarget(target)` | `this` | Set mount target (chainable) |
| `setHooks(hooks)` | `this` | Set lifecycle hooks (chainable) |

### Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | Unique instance ID (readonly) |
| `vNode` | `VNode` | Vue virtual node |
| `target` | `Element` | Mount target element |
| `componentInstance` | `ComponentPublicInstance` | Mounted component instance |

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `Mount.instances` | `Mount[]` | Get all active instances |
| `Mount.unmountAll()` | `void` | Unmount all instances |
| `Mount.destroyAll()` | `void` | Alias for `unmountAll()` |
| `Mount.getById(id)` | `Mount \| undefined` | Get instance by ID |

## Usage Examples

### Lifecycle Hooks

```typescript
const instance = new Mount(DemoVue, {
  onBeforeMount: (instance) => {
    console.log('About to mount', instance.id)
  },
  onMounted: (instance) => {
    console.log('Mounted', instance.componentInstance)
  },
  onBeforeUnmount: (instance) => {
    console.log('About to unmount')
  },
  onUnmounted: (instance) => {
    console.log('Unmounted')
  }
})
instance.mount()
```

### Event Listeners

```typescript
const instance = new Mount(DemoVue, {
  listeners: {
    click: (event) => console.log('Clicked!', event),
    close: () => instance.unmount()
  }
})
// or use 'on' alias
const instance2 = new Mount(DemoVue, {
  on: {
    submit: (data) => console.log('Submitted:', data)
  }
})
```

### Slots

```typescript
import { h } from 'vue'

const instance = new Mount(ModalComponent, {
  slots: {
    default: [h('p', 'Modal content')],
    header: [h('h2', 'Title')],
    footer: [h('button', 'Close')]
  }
})
```

### Ref Access

```typescript
import { ref } from 'vue'

const componentRef = ref(null)
const instance = new Mount(DemoVue, { ref: componentRef })

instance.mount()
// Access the component instance
console.log(componentRef.value) // ComponentPublicInstance
```

### Async Components

```typescript
// Async component with dynamic import
const instance = new Mount(
  () => import('./HeavyComponent.vue'),
  { parent: proxy.$root }
)
instance.mount()
```

### Chained API

```typescript
const instance = new Mount(DemoVue)
  .setProps({ title: 'Hello' })
  .setListeners({ click: handleClick })
  .setTarget('#modal-container')
  .setHooks({ onMounted: () => console.log('Ready!') })
  .mount()
```

### Instance Management

```typescript
// Get all active instances
const allInstances = Mount.instances
console.log(`Active instances: ${allInstances.length}`)

// Get specific instance by ID
const instance = Mount.getById(1)

// Unmount all instances at once
Mount.unmountAll()
```

## Migration from v3.x to v4.0

### Breaking Changes

#### 1. Build Output File Names

If you reference the build files directly, update the paths:

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | removed |
| `dist/index.global.prod.js` | removed |

#### 2. Node.js Version

Minimum Node.js version increased from `>=12.20` to `>=14.14.0`.

#### 3. CDN Links

Update your CDN links:

```html
<!-- v3.x -->
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>

<!-- v4.0 -->
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

### New Features (Optional Adoption)

v4.0 introduces many new features that are backward compatible:

```typescript
// Lifecycle hooks
const instance = new Mount(Component, {
  onBeforeMount: (instance) => console.log('before mount'),
  onMounted: (instance) => console.log('mounted'),
})

// Event listeners
const instance = new Mount(Component, {
  listeners: { click: handleClick },
  // or
  on: { click: handleClick },
})

// Ref support
const ref = { value: null }
new Mount(Component, { ref })

// Chained API
new Mount(Component)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .mount()

// Instance management
const allInstances = Mount.instances
Mount.unmountAll()
const instance = Mount.getById(1)
```

### No Code Changes Required

If you only use the basic API, no code changes are needed:

```typescript
// This still works in v4.0
const instance = new Mount(Component, { parent: this.$root })
instance.mount()
instance.unmount()
```

## Build Outputs

| File | Format | Description |
|------|--------|-------------|
| `index.mjs` | ESM | ES Module for bundlers |
| `index.cjs` | CJS | CommonJS for Node.js |
| `index.iife.js` | IIFE | Browser build |
| `index.iife.min.js` | IIFE | Browser build (minified) |
| `index.es5.js` | UMD | ES5 compatible build |
| `index.es5.min.js` | UMD | ES5 compatible build (minified) |

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

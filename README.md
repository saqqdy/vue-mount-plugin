<div style="text-align: center;" align="center">

# vue-mount-plugin

A simple and easy to use Vue instance extension plugin that supports Vue 2.0 and Vue 3.0

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

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
<!-- App.vue -->
<script setup>
import { mount, createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// Mount and show immediately
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

// Or create first, show later
const instance2 = createMount(Modal, { props: { title: 'Deferred' } })
instance2.show()

// Unmount when done
instance.unmount()
</script>
```

### Use in Vue `2.7`

```vue
<!-- App.vue -->
<script>
import { mount, createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

export default {
  methods: {
    showModal() {
      const instance = mount(Modal, {
        props: { title: 'Hello' },
        parent: this.$root
      })
    }
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

### Import in Browser

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
  // Global: VueMount.mount, VueMount.createMount, etc.
  const instance = VueMount.mount(DemoVue, { props: { title: 'Hello' } })
  instance.unmount()
</script>
```

### IE11 Support

For IE11 compatibility, use the ES5 build:

```html
<head>
  <!-- Import vue2 (Vue 3 does not support IE11) -->
  <script src="//unpkg.com/vue@2"></script>
  <!-- Import ES5 build for IE11 -->
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.es5.min.js"></script>
</head>
```

> **Note:** Vue 3 does not support IE11. Use Vue 2 with the ES5 build for IE11 compatibility.

## API

### Core Functions

| Function | Description |
|----------|-------------|
| `mount(component, options?)` | Create and immediately show component |
| `createMount(component, options?)` | Create instance without showing (manual control) |

### Mount Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `props` | `object` | - | Props to pass to component |
| `target` | `Element \| string` | - | Mount target element or selector |
| `tagName` | `string` | `'div'` | Tag name for auto-created container |
| `app` | `App` | - | Vue 3 app instance (for context inheritance) |
| `parent` | `unknown` | - | Parent component instance (Vue 2) |
| `context` | `object` | - | Vue 2 context (router, store, i18n) |
| `listeners` | `Listeners` | - | Event listeners object |
| `on` | `Listeners` | - | Event listeners (alias) |
| `slots` | `Slots` | - | Slots object |
| `singleton` | `boolean \| string` | - | Singleton mode |
| `zIndex` | `number` | - | z-index level |

### Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `onBeforeMount` | Called before component is mounted |
| `onMounted` | Called after component is mounted |
| `onBeforeUnmount` | Called before component is unmounted |
| `onUnmounted` | Called after component is unmounted |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `show()` | `this` | Show/mount the component |
| `hide()` | `this` | Hide component (keep instance) |
| `unmount()` | `void` | Unmount and destroy completely |
| `destroy()` | `void` | Alias for `unmount()` |
| `remove()` | `void` | Alias for `unmount()` |
| `setProps(props)` | `this` | Update props (chainable) |
| `setTarget(target)` | `this` | Set mount target (chainable) |
| `setSlots(slots)` | `this` | Set slots (chainable) |
| `setHooks(hooks)` | `this` | Set lifecycle hooks (chainable) |
| `on(event, handler)` | `this` | Add event listener (chainable) |
| `off(event, handler?)` | `this` | Remove event listener (chainable) |
| `emit(event, ...args)` | `this` | Emit event (chainable) |

### Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique instance ID |
| `mounted` | `boolean` | Whether component is mounted |
| `el` | `HTMLElement \| null` | DOM element |
| `vm` | `ComponentPublicInstance \| null` | Vue component instance |
| `options` | `MountOptions` | Merged options |

### Global Functions

| Function | Description |
|----------|-------------|
| `getInstances()` | Get all active instances |
| `getInstanceById(id)` | Get instance by ID |
| `unmountAll()` | Unmount all instances |
| `isMounted(id)` | Check if instance is mounted |
| `getActiveInstanceIds()` | Get all active instance IDs |
| `setGlobalConfig(config)` | Set global configuration |
| `globalConfig` | Global configuration object |

## Usage Examples

### Basic Usage

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// Mount and show immediately
const instance = mount(Modal, {
  props: { title: 'Hello World' }
})

// Unmount when done
instance.unmount()
```

### Promise Support

```typescript
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

// Await user confirmation
const result = await mount(ConfirmDialog, {
  props: {
    message: 'Are you sure?'
  }
})

console.log(result ? 'Confirmed' : 'Cancelled')
```

> The Promise resolves when the component emits a `close` event.

### Singleton Mode

```typescript
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

// Only one toast instance exists at a time
mount(Toast, {
  singleton: true,
  props: { message: 'Hello!' }
})

// Using custom key for different singleton groups
mount(Toast, {
  singleton: 'error-toast',
  props: { message: 'Error!', type: 'error' }
})
```

### Event System

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal)

// Listen to events
instance.on('submit', (data) => {
  console.log('Submitted:', data)
})

// Chaining
instance
  .on('close', () => console.log('Closed'))
  .on('error', (err) => console.error(err))
```

### Lifecycle Hooks

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = createMount(Modal, {
  onBeforeMount: (instance) => {
    console.log('About to mount')
  },
  onMounted: (instance) => {
    console.log('Mounted', instance.el)
  },
  onBeforeUnmount: (instance) => {
    console.log('About to unmount')
  },
  onUnmounted: (instance) => {
    console.log('Unmounted')
  }
})

instance.show()
```

### Manual Control

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// Create without showing
const instance = createMount(Modal, {
  props: { title: 'Manual Control' }
})

console.log(instance.mounted) // false

// Show when needed
instance.show()
console.log(instance.mounted) // true

// Hide but keep instance
instance.hide()
console.log(instance.mounted) // true (still tracked)

// Destroy completely
instance.unmount()
console.log(instance.mounted) // false
```

### Props Update

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: { title: 'Original' }
})

// Update props dynamically
instance.setProps({ title: 'Updated!' })

// Chain with other methods
instance
  .setProps({ loading: true })
  .setProps({ loading: false, title: 'Done' })
```

### Context Inheritance (Vue 3)

```typescript
import { mount } from 'vue-mount-plugin'
import { getCurrentInstance } from 'vue'
import Modal from './Modal.vue'

// In Vue 3, pass app for context inheritance
const { appContext } = getCurrentInstance()!

const instance = mount(Modal, {
  app: appContext.app,
  props: { title: 'With Context' }
})

// Component can now use router, store, i18n, etc.
```

### useMount Composable

```typescript
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount, unmountAll, count, instances } = useMount()

// Mount component (auto cleanup on unmount)
const instance = mount(Modal, { props: { title: 'Hello' } })

// Track active instances
console.log(count.value) // 1
console.log(instances.value) // [instance]

// Unmount all at once
unmountAll()
```

### Vue Plugin

```typescript
import { createApp } from 'vue'
import { MountPlugin } from 'vue-mount-plugin'
import App from './App.vue'

const app = createApp(App)

// Install with default name ($show)
app.use(MountPlugin, { zIndex: 2000 })

// Or with custom name
app.use(MountPlugin, { name: '$mount' })

// Now available in templates
// this.$show(Component, options)
```

## Migration from v3.x to v4.0

### Overview

v4.0 is a major rewrite with a cleaner functional API. This guide will help you migrate from v3.x.

### Quick Migration Checklist

- [ ] Replace `new Mount()` with `mount()` or `createMount()`
- [ ] Update property names (`id` is now string, `componentInstance` → `vm`)
- [ ] Update method calls (`.mount()` → `.show()`)
- [ ] Update static method calls (`.instances` → `getInstances()`)
- [ ] Update build file paths if using CDN

### API Changes

#### Core API

| v3.x | v4.0 | Notes |
|------|------|-------|
| `new Mount(component, options)` | `mount(component, options)` | Create + show immediately |
| `new Mount(component, options)` | `createMount(component, options)` | Create only, manual show |
| `instance.mount()` | `instance.show()` | Method renamed |
| `instance.destroy()` | `instance.unmount()` | Method renamed (alias still works) |
| `instance.remove()` | `instance.unmount()` | Alias still works |

#### Instance Properties

| v3.x | v4.0 | Notes |
|------|------|-------|
| `instance.id` (number) | `instance.id` (string) | Now string for better uniqueness |
| `instance.componentInstance` | `instance.vm` | Renamed for consistency |
| `instance.vNode` | - | Removed, use `instance.vm` |
| `instance.target` | `instance.el` | Renamed |
| - | `instance.mounted` | New: boolean state |

#### Static Methods → Functions

| v3.x | v4.0 |
|------|------|
| `Mount.instances` | `getInstances()` |
| `Mount.getById(id)` | `getInstanceById(id)` |
| `Mount.unmountAll()` | `unmountAll()` |
| `Mount.destroyAll()` | `unmountAll()` |

#### Options Changes

| v3.x | v4.0 | Notes |
|------|------|-------|
| `parent` | `parent` | Still supported (Vue 2) |
| - | `app` | New: Vue 3 context inheritance |
| - | `singleton` | New: singleton mode |
| - | `onBeforeMount` | New: lifecycle hook |
| - | `onMounted` | New: lifecycle hook |
| - | `onBeforeUnmount` | New: lifecycle hook |
| - | `onUnmounted` | New: lifecycle hook |

### Code Migration Examples

#### Basic Usage

```typescript
// ❌ v3.x
import Mount from 'vue-mount-plugin'
const instance = new Mount(Modal, { parent: this.$root })
instance.mount()
instance.unmount()

// ✅ v4.0
import { mount } from 'vue-mount-plugin'
const instance = mount(Modal, { app: this.$root })
instance.unmount()
```

#### Deferred Mount

```typescript
// ❌ v3.x
import Mount from 'vue-mount-plugin'
const instance = new Mount(Modal, options)
// ... later
instance.mount()

// ✅ v4.0
import { createMount } from 'vue-mount-plugin'
const instance = createMount(Modal, options)
// ... later
instance.show()
```

#### Instance Management

```typescript
// ❌ v3.x
const all = Mount.instances
const found = Mount.getById(1)
Mount.unmountAll()

// ✅ v4.0
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'
const all = getInstances()
const found = getInstanceById('mount-1-xxx')
unmountAll()
```

#### Access Component Instance

```typescript
// ❌ v3.x
const instance = new Mount(Modal)
instance.mount()
console.log(instance.componentInstance)

// ✅ v4.0
const instance = mount(Modal)
console.log(instance.vm)
```

#### Event Listeners

```typescript
// ❌ v3.x
const instance = new Mount(Modal, {
  listeners: { close: handleClose }
})
instance.mount()

// ✅ v4.0 - Option 1: via options
const instance = mount(Modal, {
  listeners: { close: handleClose }
})

// ✅ v4.0 - Option 2: via method (new!)
const instance = mount(Modal)
instance.on('close', handleClose)
```

#### Chained API

```typescript
// ❌ v3.x
const instance = new Mount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .mount()

// ✅ v4.0
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .show()
```

### New Features in v4.0

#### 1. Singleton Mode

Only one instance of a component exists at a time:

```typescript
import { mount } from 'vue-mount-plugin'

// Multiple calls - only one toast shows
mount(Toast, {
  singleton: true,
  props: { message: 'Hello' }
})
```

#### 2. Promise Support

Await user interaction results:

```typescript
import { mount } from 'vue-mount-plugin'

const confirmed = await mount(ConfirmDialog, {
  props: { message: 'Are you sure?' }
})

if (confirmed) {
  // User clicked confirm
}
```

#### 3. hide() Method

Hide without destroying:

```typescript
import { mount } from 'vue-mount-plugin'

const instance = mount(Modal)
instance.hide()    // Hidden but instance preserved
instance.show()    // Show again
instance.unmount() // Destroy completely
```

#### 4. useMount Composable

Auto cleanup in Vue 3 components:

```typescript
import { useMount } from 'vue-mount-plugin'

const { mount, unmountAll, count } = useMount()

// Instances auto-cleaned when component unmounts
const instance = mount(Modal)
```

#### 5. Global Configuration

Set defaults for all instances:

```typescript
import { setGlobalConfig, globalConfig } from 'vue-mount-plugin'

setGlobalConfig({ zIndex: 2000 })

// All instances inherit this config
mount(Modal) // zIndex: 2000
```

### Build Output Changes

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | removed |
| `dist/index.global.prod.js` | removed |

### CDN Migration

```html
<!-- ❌ v3.x -->
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>

<!-- ✅ v4.0 -->
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

### Node.js Version

Minimum Node.js version: `>=14.14.0` (was `>=12.20`)

### Migration Script

For large projects, you can use this regex replacement guide:

| Find | Replace |
|------|---------|
| `new Mount\(([^)]+)\)` | `mount($1)` |
| `\.mount\(\)` | `.show()` |
| `Mount\.instances` | `getInstances()` |
| `Mount\.getById\(([^)]+)\)` | `getInstanceById($1)` |
| `Mount\.unmountAll\(\)` | `unmountAll()` |
| `\.componentInstance` | `.vm` |
| `\.target` | `.el` |

## Build Outputs

| File | Format | Description |
|------|--------|-------------|
| `index.mjs` | ESM | ES Module for bundlers |
| `index.cjs` | CJS | CommonJS for Node.js |
| `index.iife.js` | IIFE | Browser build |
| `index.iife.min.js` | IIFE | Browser build (minified) |
| `index.es5.js` | UMD | ES5 compatible build (IE11 support) |
| `index.es5.min.js` | UMD | ES5 compatible build (minified, IE11 support) |

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| IE 11 | ✅ Use ES5 build (`index.es5.min.js`) |

> For IE11, use Vue 2 and the ES5 build. Vue 3 does not support IE11.

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

# Getting Started

## Installation

::: code-group

```bash [pnpm]
pnpm add vue-mount-plugin
```

```bash [npm]
npm install vue-mount-plugin
```

```bash [yarn]
yarn add vue-mount-plugin
```

:::

## Quick Example

### Vue 3

```vue
<script setup>
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

function showModal() {
  mount(Modal, {
    props: { title: 'Hello World' }
  })
}
</script>

<template>
  <button @click="showModal">Show Modal</button>
</template>
```

### Vue 2.7

```vue
<script>
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

export default {
  methods: {
    showModal() {
      mount(Modal, {
        props: { title: 'Hello World' },
        parent: this // For context inheritance in Vue 2
      })
    }
  }
}
</script>

<template>
  <button @click="showModal">Show Modal</button>
</template>
```

### Vue 2.6 or Earlier

First, install `@vue/composition-api`:

```bash
npm install @vue/composition-api
```

Then use the same API as Vue 2.7.

## Browser Usage

```html
<head>
  <script src="//unpkg.com/vue@3"></script>
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
</head>

<script>
  const instance = VueMount.mount(MyComponent, {
    props: { title: 'Hello' }
  })
</script>
```

## Key Concepts

### mount() vs createMount()

- **`mount()`**: Create instance and show immediately (most common)
- **`createMount()`**: Create instance only, show later (manual control)

```typescript
// Auto show
const instance = mount(Modal, options)

// Manual control
const instance = createMount(Modal, options)
instance.show()    // Show when needed
instance.hide()    // Hide but keep instance
instance.unmount() // Destroy completely
```

### Instance Lifecycle

```
createMount() → show() → mounted
                        ↓
                    hide() → hidden (instance preserved)
                        ↓
                    show() → mounted again
                        ↓
                    unmount() → destroyed
```

## Next Steps

- [Basic Usage](/guide/basic-usage) - Learn common patterns
- [Advanced Usage](/guide/advanced-usage) - Explore advanced features
- [API Reference](/api/) - Full API documentation

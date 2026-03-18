# vue-mount-plugin Examples

This directory contains example projects demonstrating all features of vue-mount-plugin v4.0.

## 🌐 Online Demo

Try it online with StackBlitz:

| Framework | Link |
| --------- | ---- |
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue2) |

## 📁 Local Development

### Vue 3 Example (`vue3/`)

Full-featured example using Vue 3 with Composition API and TypeScript.

```bash
cd examples/vue3
pnpm install
pnpm dev
```

### Vue 2 Example (`vue2/`)

Full-featured example using Vue 2.7 with Options API.

```bash
cd examples/vue2
pnpm install
pnpm dev
```

## ✨ Features Demonstrated

Both examples cover:

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Basic Mount/Unmount** | Simple component mounting and unmounting |
| 2 | **Lifecycle Hooks** | `onBeforeMount`, `onMounted`, `onBeforeUnmount`, `onUnmounted` |
| 3 | **Event Listeners** | Component event handling via `listeners` or `on` option |
| 4 | **Slots Support** | Passing slot content to mounted components |
| 5 | **Ref Support** | Getting component instance reference |
| 6 | **Chained API** | Fluent method chaining for configuration |
| 7 | **Instance Management** | `Mount.instances`, `Mount.unmountAll()`, `Mount.getById()` |
| 8 | **Modal Pattern** | Common modal dialog implementation |
| 9 | **Custom Target** | Mounting to specific DOM elements |

### Vue 3 Only Features

| # | Feature | Description |
|---|---------|-------------|
| 8 | **Async Component** | Using `defineAsyncComponent` with dynamic import |

## 📖 API Overview

```typescript
import Mount from 'vue-mount-plugin'

// Basic usage
const instance = new Mount(Component, { parent: this.$root })
instance.mount()
instance.unmount()

// With options
const instance = new Mount(Component, {
  parent: this.$root,
  props: { title: 'Hello' },
  listeners: { close: () => instance.unmount() },
  onBeforeMount: (instance) => console.log('before mount'),
  onMounted: (instance) => console.log('mounted'),
})

// Chained API
new Mount(Component)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .setListeners({ close: handleClose })
  .mount()

// Instance management
Mount.instances           // Get all active instances
Mount.unmountAll()        // Unmount all instances
Mount.getById(1)          // Get instance by ID
```

## 🔧 Vue 2 Compatibility Notes

When using Vue 2, the plugin automatically:

1. Creates a wrapper element inside the specified target to prevent `$mount` from replacing the target element
2. Uses `propsData` for passing props to the component
3. Uses `$on` for event binding instead of props-based event handlers

This ensures consistent behavior between Vue 2 and Vue 3.

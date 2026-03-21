---
layout: home

hero:
  name: vue-mount-plugin
  text: Vue Component Mounting Made Simple
  tagline: A simple and easy to use Vue instance extension plugin that supports Vue 2.0 and Vue 3.0
  image:
    src: /logo.svg
    alt: vue-mount-plugin
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/saqqdy/vue-mount-plugin

features:
  - icon: ⚡
    title: Simple API
    details: Clean functional API with mount() and createMount() for easy component mounting
  - icon: 🔄
    title: Vue 2 & 3 Support
    details: Works seamlessly with both Vue 2.x and Vue 3.x via vue-demi
  - icon: 🎯
    title: TypeScript First
    details: Full TypeScript support with comprehensive type definitions
  - icon: 🧩
    title: Singleton Mode
    details: Built-in singleton support for unique component instances
  - icon: 📡
    title: Event System
    details: Instance-level event emitter for component communication
  - icon: ⏳
    title: Promise Support
    details: Async/await support for dialog-style components
---

## Quick Start

### Install

```bash
# pnpm
pnpm add vue-mount-plugin

# npm
npm install vue-mount-plugin

# yarn
yarn add vue-mount-plugin
```

### Usage

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

## Why vue-mount-plugin?

- **No Boilerplate**: No need to manually manage DOM elements and Vue instances
- **Flexible Control**: Fine-grained control over component lifecycle
- **Context Inheritance**: Proper context inheritance for Vue 3 (router, pinia, i18n)
- **Auto Cleanup**: Automatic cleanup with useMount composable
- **Lightweight**: Small bundle size with tree-shaking support

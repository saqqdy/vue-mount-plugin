# Vue Plugin

## Installation

Register the plugin with your Vue app:

### Vue 3

```typescript
import { createApp } from 'vue'
import { MountPlugin } from 'vue-mount-plugin'
import App from './App.vue'

const app = createApp(App)

// Install with default name ($show)
app.use(MountPlugin, { zIndex: 2000 })
```

### Vue 2

```typescript
import Vue from 'vue'
import { MountPlugin } from 'vue-mount-plugin'

Vue.use(MountPlugin, { zIndex: 2000 })
```

## Plugin Options

```typescript
interface MountPluginOptions {
  // Custom name for the global method (default: '$show')
  name?: string

  // Default z-index for all instances
  zIndex?: number

  // Default container
  container?: string | Element

  // Default transition
  transition?: string | TransitionOptions
}
```

## Usage in Components

### Vue 3 Options API

```typescript
export default {
  methods: {
    showModal() {
      this.$show(Modal, {
        props: { title: 'Hello' }
      })
    }
  }
}
```

### Vue 2

```typescript
export default {
  methods: {
    showModal() {
      this.$show(Modal, {
        props: { title: 'Hello' },
        parent: this
      })
    }
  }
}
```

## Custom Method Name

```typescript
// Use custom name
app.use(MountPlugin, { name: '$mount' })

// Now available as
this.$mount(Modal, options)
```

## Global Configuration

The plugin options become global defaults:

```typescript
app.use(MountPlugin, {
  zIndex: 2000,
  transition: 'fade'
})

// All instances inherit these defaults
this.$show(Modal) // zIndex: 2000, transition: 'fade'

// Override per instance
this.$show(Modal, { zIndex: 3000 }) // zIndex: 3000
```

## TypeScript Support

Add type declaration for the global method:

```typescript
// env.d.ts
import { MountOptions, MountInstance } from 'vue-mount-plugin'

declare module 'vue' {
  interface ComponentCustomProperties {
    $show: (component: any, options?: MountOptions) => MountInstance
  }
}
```

## Comparison: Plugin vs Direct Import

| Feature | Plugin (`this.$show`) | Direct Import (`mount`) |
|---------|----------------------|------------------------|
| Global defaults | ✅ | ✅ (via setGlobalConfig) |
| Template access | ✅ | ❌ |
| Composition API | ❌ | ✅ |
| Tree-shaking | ❌ | ✅ |
| TypeScript | Needs declaration | Built-in |

::: tip Recommendation
For Vue 3 with Composition API, prefer direct import:

```typescript
import { mount } from 'vue-mount-plugin'
```

For Vue 2 or Options API, the plugin approach is convenient.
:::

# MountOptions

Configuration options for mounting components.

## Basic Configuration

### target

- **Type**: `string | Element | ShadowRoot | null`
- **Default**: `null` (document.body)

Mount target element or selector.

```typescript
mount(Modal, { target: '#container' })
mount(Modal, { target: document.getElementById('app') })
```

### tagName

- **Type**: `string`
- **Default**: `'div'`

Tag name for the auto-created container element.

```typescript
mount(Modal, { tagName: 'section' })
```

### zIndex

- **Type**: `number`
- **Default**: undefined

z-index for the container element.

```typescript
mount(Modal, { zIndex: 2000 })
```

## Component Configuration

### props

- **Type**: `object | null`
- **Default**: undefined

Props to pass to the component.

```typescript
mount(UserProfile, {
  props: {
    userId: 123,
    editable: true
  }
})
```

### slots

- **Type**: `Slots`
- **Default**: undefined

Slot content to pass to the component.

```typescript
import { h } from 'vue'

mount(Modal, {
  slots: {
    default: [h('p', 'Modal content')],
    header: [h('h2', 'Title')],
    footer: [h('button', 'Close')]
  }
})
```

## Event Configuration

### listeners

- **Type**: `Listeners`
- **Default**: undefined

Event listeners to attach to the component.

```typescript
mount(Modal, {
  listeners: {
    close: () => console.log('Closed'),
    submit: (data) => console.log('Submitted:', data)
  }
})
```

### on

- **Type**: `Listeners`
- **Default**: undefined

Alias for `listeners`.

```typescript
mount(Modal, {
  on: {
    close: handleClose
  }
})
```

## Context Configuration

### app (Vue 3)

- **Type**: `App`
- **Default**: undefined

Vue 3 app instance for context inheritance.

```typescript
import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()!

mount(Modal, {
  app: appContext.app
})
```

### parent (Vue 2)

- **Type**: `unknown`
- **Default**: undefined

Parent component instance for Vue 2 context inheritance.

```typescript
mount(Modal, {
  parent: this
})
```

### context (Vue 2)

- **Type**: `ContextOptions`
- **Default**: undefined

Explicit context for Vue 2.

```typescript
mount(Modal, {
  context: {
    router: this.$router,
    store: this.$store,
    i18n: this.$i18n
  }
})
```

## Lifecycle Hooks

### onBeforeMount

- **Type**: `(instance: MountInstance) => void`
- **Default**: undefined

Called before the component is mounted.

```typescript
mount(Modal, {
  onBeforeMount: (instance) => {
    console.log('About to mount')
  }
})
```

### onMounted

- **Type**: `(instance: MountInstance) => void`
- **Default**: undefined

Called after the component is mounted.

```typescript
mount(Modal, {
  onMounted: (instance) => {
    console.log('Mounted', instance.el)
  }
})
```

### onBeforeUnmount

- **Type**: `(instance: MountInstance) => void`
- **Default**: undefined

Called before the component is unmounted.

```typescript
mount(Modal, {
  onBeforeUnmount: (instance) => {
    console.log('About to unmount')
  }
})
```

### onUnmounted

- **Type**: `(instance: MountInstance) => void`
- **Default**: undefined

Called after the component is unmounted.

```typescript
mount(Modal, {
  onUnmounted: (instance) => {
    console.log('Unmounted')
  }
})
```

## Advanced Options

### singleton

- **Type**: `boolean | string`
- **Default**: undefined

Enable singleton mode.

```typescript
// Boolean - use component as key
mount(Toast, { singleton: true })

// String - custom key
mount(Toast, { singleton: 'error-toast' })
```

### transition

- **Type**: `string | TransitionOptions`
- **Default**: undefined

Transition configuration.

```typescript
mount(Modal, {
  transition: 'fade'
})

// Or with options
mount(Modal, {
  transition: {
    name: 'fade',
    appear: true
  }
})
```

### delay

- **Type**: `number`
- **Default**: undefined

Delay before mounting (in milliseconds).

```typescript
mount(Modal, { delay: 100 })
```

### keepAlive

- **Type**: `KeepAliveOptions | boolean`
- **Default**: undefined

KeepAlive configuration.

```typescript
mount(Modal, {
  keepAlive: true
})

// Or with options
mount(Modal, {
  keepAlive: {
    include: ['ModalA', 'ModalB'],
    max: 5
  }
})
```

## Type Definition

```typescript
interface MountOptions extends LifecycleHooks {
  // Basic
  target?: string | Element | ShadowRoot | null
  tagName?: string
  zIndex?: number

  // Component
  props?: Data | null
  slots?: Slots

  // Events
  listeners?: Listeners
  on?: Listeners

  // Context
  app?: App
  parent?: unknown
  context?: ContextOptions
  ref?: Ref<ComponentPublicInstance | null>

  // Advanced
  singleton?: boolean | string
  transition?: string | TransitionOptions
  delay?: number
  keepAlive?: KeepAliveOptions | boolean
}
```

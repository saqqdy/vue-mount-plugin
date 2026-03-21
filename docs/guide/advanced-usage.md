# Advanced Usage

## Manual Control with createMount

For fine-grained control over the component lifecycle:

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// Create instance without showing
const instance = createMount(Modal, {
  props: { title: 'Delayed Modal' }
})

console.log(instance.mounted) // false

// Show when needed
instance.show()
console.log(instance.mounted) // true

// Hide without destroying
instance.hide()
console.log(instance.mounted) // true (still tracked)

// Show again
instance.show()

// Destroy completely
instance.unmount()
console.log(instance.mounted) // false
```

## Context Inheritance

### Vue 3

Pass the `app` instance for proper context inheritance:

```typescript
import { getCurrentInstance } from 'vue'
import { mount } from 'vue-mount-plugin'

const { appContext } = getCurrentInstance()!

const instance = mount(MyComponent, {
  app: appContext.app,
  props: { title: 'Hello' }
})

// Component can now use:
// - router (useRouter)
// - pinia stores (useStore)
// - i18n (useI18n)
// - any provided values
```

### Vue 2

Pass `parent` for context inheritance:

```typescript
import { mount } from 'vue-mount-plugin'

export default {
  methods: {
    showModal() {
      mount(MyComponent, {
        parent: this,
        props: { title: 'Hello' }
      })
    }
  }
}
```

### Vue 2 with context option

```typescript
mount(MyComponent, {
  parent: this,
  context: {
    router: this.$router,
    store: this.$store,
    i18n: this.$i18n
  }
})
```

## Slots

Pass slot content to the mounted component:

```typescript
import { h } from 'vue'
import { mount } from 'vue-mount-plugin'

mount(Modal, {
  props: { title: 'Hello' },
  slots: {
    default: [h('p', 'Modal content')],
    header: [h('h2', 'Custom Header')],
    footer: [h('button', 'Close')]
  }
})
```

## Props Update

Dynamically update props after mounting:

```typescript
const instance = mount(Modal, {
  props: {
    title: 'Original Title',
    loading: false
  }
})

// Update single prop
instance.setProps({ loading: true })

// Update multiple props
instance.setProps({
  title: 'Updated Title',
  loading: false
})

// Props are merged
console.log(instance.options.props)
// { title: 'Updated Title', loading: false }
```

## Event System Details

### Multiple Listeners

```typescript
const instance = mount(Modal)

// Multiple listeners for same event
instance.on('update', handler1)
instance.on('update', handler2)

// Both handlers are called on emit
instance.emit('update', data)
```

### Remove Listeners

```typescript
// Remove specific listener
instance.off('update', handler)

// Remove all listeners for an event
instance.off('update')
```

### Emit Events

```typescript
instance.emit('custom-event', arg1, arg2, arg3)
```

### Chaining

```typescript
instance
  .on('event1', handler1)
  .on('event2', handler2)
  .off('event1')
  .emit('event2', data)
```

## Global Configuration

Set defaults for all instances:

```typescript
import { setGlobalConfig, globalConfig } from 'vue-mount-plugin'

// Set global defaults
setGlobalConfig({
  zIndex: 2000,
  tagName: 'section'
})

// All instances inherit these defaults
mount(Modal) // zIndex: 2000, tagName: 'section'

// Instance options override global config
mount(Modal, { zIndex: 3000 }) // zIndex: 3000
```

## Instance Management

### Get All Instances

```typescript
import { getInstances } from 'vue-mount-plugin'

const instances = getInstances()
console.log(`Active instances: ${instances.length}`)
```

### Get Instance by ID

```typescript
import { getInstanceById } from 'vue-mount-plugin'

const instance = getInstanceById('mount-1-abc123')
if (instance) {
  instance.unmount()
}
```

### Unmount All

```typescript
import { unmountAll } from 'vue-mount-plugin'

// Cleanup all instances
unmountAll()
```

### Check Mounted Status

```typescript
import { isMounted } from 'vue-mount-plugin'

if (isMounted('mount-1-abc123')) {
  console.log('Instance is mounted')
}
```

## Singleton Management

```typescript
import {
  hasSingleton,
  getSingleton,
  clearSingletons
} from 'vue-mount-plugin'

// Check if singleton exists
if (hasSingleton('my-toast')) {
  console.log('Toast already exists')
}

// Get singleton instance
const existing = getSingleton('my-toast')

// Clear all singletons
clearSingletons()
```

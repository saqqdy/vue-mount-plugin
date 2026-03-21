# Basic Usage

## Simple Mount

The most basic usage - mount a component and show it immediately:

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: {
    title: 'Hello World',
    content: 'This is a modal'
  }
})

// Later, unmount when done
instance.unmount()
```

## Passing Props

```typescript
mount(UserProfile, {
  props: {
    userId: 123,
    editable: true
  }
})
```

## Event Handling

### Via listeners option

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  listeners: {
    close: () => console.log('Closed'),
    submit: (data) => console.log('Submitted:', data)
  }
})
```

### Via on option (alias)

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  on: {
    close: () => console.log('Closed')
  }
})
```

### Via instance.on()

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

instance.on('close', () => {
  console.log('Modal closed')
})

instance.on('submit', (data) => {
  console.log('Form submitted:', data)
})
```

## Promise Support

Use async/await for dialog-style components:

```typescript
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

async function handleDelete() {
  const confirmed = await mount(ConfirmDialog, {
    props: {
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?'
    }
  })

  if (confirmed) {
    // User clicked confirm
    await deleteItem()
  }
}
```

::: tip
The Promise resolves when the component emits a `close` event with a value.
:::

## Singleton Mode

Ensure only one instance exists at a time:

```typescript
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

// Multiple rapid calls - only one toast shows
function showNotification(message) {
  mount(Toast, {
    singleton: true,
    props: { message }
  })
}
```

### Custom Singleton Key

Use different keys for different singleton groups:

```typescript
// Error toasts
mount(Toast, {
  singleton: 'error-toast',
  props: { message: 'Error!', type: 'error' }
})

// Success toasts (separate singleton)
mount(Toast, {
  singleton: 'success-toast',
  props: { message: 'Success!', type: 'success' }
})
```

## Lifecycle Hooks

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  onBeforeMount: (instance) => {
    console.log('About to mount')
  },
  onMounted: (instance) => {
    console.log('Mounted')
  },
  onBeforeUnmount: (instance) => {
    console.log('About to unmount')
  },
  onUnmounted: (instance) => {
    console.log('Unmounted')
  }
})
```

## Chained API

All setter methods return `this` for chaining:

```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .on('close', handleClose)
  .setTarget('#modal-container')
  .setHooks({ onMounted: () => console.log('Ready!') })

instance.show()
```

## Mount Target

### Default (document.body)

```typescript
mount(Modal) // Appends to document.body
```

### Custom Element

```typescript
mount(Modal, {
  target: document.getElementById('app')
})
```

### Selector String

```typescript
mount(Modal, {
  target: '#modal-container'
})
```

## Custom Container Tag

By default, a `<div>` is created as container:

```typescript
mount(Modal, {
  tagName: 'section' // Creates <section> instead
})
```

## z-index Control

```typescript
mount(Modal, {
  zIndex: 2000
})
```

# Modal Example

This example demonstrates how to create a basic modal component.

## Modal Component

```vue
<!-- Modal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  content: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
</style>
```

## Usage

### Basic

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

mount(Modal, {
  props: {
    title: 'Hello World',
    content: 'This is a modal dialog'
  }
})
```

### With Event Handling

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

instance.on('close', () => {
  console.log('Modal closed')
})
```

### With Lifecycle Hooks

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  onMounted: (instance) => {
    console.log('Modal mounted', instance.el)
  },
  onUnmounted: () => {
    console.log('Modal unmounted')
  }
})
```

### Custom z-index

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  zIndex: 2000
})
```

## Auto-close Example

Create a modal that auto-closes after a delay:

```typescript
const instance = mount(Modal, {
  props: {
    title: 'Auto-close',
    content: 'This modal will close in 3 seconds'
  }
})

setTimeout(() => {
  instance.unmount()
}, 3000)
```

## Chained Configuration

```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Configured Modal' })
  .on('close', () => instance.unmount())
  .setHooks({
    onMounted: () => console.log('Ready')
  })

instance.show()
```

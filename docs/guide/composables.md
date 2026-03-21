# Composables

## useMount

The `useMount` composable provides a convenient way to manage multiple instances with automatic cleanup in Vue 3.

### Basic Usage

```typescript
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount, unmountAll, count, instances } = useMount()

// Mount a component
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

// Track active instances
console.log(count.value) // 1
console.log(instances.value) // [instance]

// Unmount all instances managed by this composable
unmountAll()
```

### Auto Cleanup

When the component using `useMount` is unmounted, all instances created by that composable are automatically cleaned up:

```vue
<script setup>
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount } = useMount()

function showModal() {
  mount(Modal, { props: { title: 'Hello' } })
}
// When this component unmounts, the modal is automatically unmounted
</script>
```

### API Reference

```typescript
interface UseMountReturn {
  // Reactive array of instances
  instances: Ref<MountInstance[]>

  // Mount a component
  mount: <T = any>(component: any, options?: MountOptions) => MountInstance<T>

  // Unmount a specific instance
  unmount: (instance: MountInstance) => void

  // Unmount all instances
  unmountAll: () => void

  // Get instance by ID
  getById: (id: string) => MountInstance | undefined

  // Check if any instances exist
  hasInstances: () => boolean

  // Reactive count of instances
  count: Ref<number>
}
```

### Example: Toast Manager

```vue
<template>
  <div>
    <button @click="showToast">Show Toast</button>
    <button @click="unmountAll">Clear All ({{ count }})</button>
  </div>
</template>

<script setup>
import { useMount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

const { mount, unmountAll, count } = useMount()

function showToast() {
  mount(Toast, {
    props: { message: `Toast #${count.value + 1}` }
  })
}
</script>
```

### Example: Modal Stack

```vue
<template>
  <button @click="pushModal">Push Modal</button>
  <p>Open modals: {{ count }}</p>
</template>

<script setup>
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount, unmountAll, count, instances } = useMount()
let modalId = 0

function pushModal() {
  const id = ++modalId
  const instance = mount(Modal, {
    props: {
      title: `Modal ${id}`,
      zIndex: 1000 + count.value
    }
  })

  instance.on('close', () => {
    // Instance is already removed from instances array
    console.log(`Modal ${id} closed`)
  })
}
</script>
```

## useSingleton

The `useSingleton` composable provides a convenient interface for singleton instances.

### Basic Usage

```typescript
import { useSingleton } from 'vue-mount-plugin'
import Toast from './Toast.vue'

const { getOrCreate } = useSingleton()

// Get existing or create new
const instance = getOrCreate('my-toast', Toast, {
  props: { message: 'Hello' }
})

instance.show()
```

### API Reference

```typescript
interface UseSingletonReturn {
  // Get existing singleton or create new one
  getOrCreate: <T = any>(
    key: string,
    component: any,
    options?: MountOptions
  ) => MountInstance<T>
}
```

### Example: Global Toast

```vue
<template>
  <button @click="showSuccess">Success</button>
  <button @click="showError">Error</button>
</template>

<script setup>
import { useSingleton } from 'vue-mount-plugin'
import Toast from './Toast.vue'

const { getOrCreate } = useSingleton()

function showSuccess() {
  const toast = getOrCreate('toast', Toast, {
    props: { message: 'Success!', type: 'success' }
  })
}

function showError() {
  const toast = getOrCreate('toast', Toast, {
    props: { message: 'Error!', type: 'error' }
  })
}
</script>
```

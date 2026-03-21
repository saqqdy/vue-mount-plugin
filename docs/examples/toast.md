# Toast Example

This example demonstrates singleton toast notifications.

## Toast Component

```vue
<!-- Toast.vue -->
<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', type]">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'error', 'warning'].includes(v)
  },
  duration: { type: Number, default: 3000 }
})

const emit = defineEmits(['close'])
const visible = ref(false)

onMounted(() => {
  visible.value = true

  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 300) // Wait for transition
  }, props.duration)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info { background: #2196f3; }
.success { background: #4caf50; }
.error { background: #f44336; }
.warning { background: #ff9800; }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
```

## Usage

### Basic

```typescript
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

mount(Toast, {
  props: {
    message: 'Hello World',
    type: 'success'
  }
})
```

### Singleton Mode

Only one toast at a time:

```typescript
// Multiple rapid calls - only one toast shows
function showSuccess(message) {
  mount(Toast, {
    singleton: true,
    props: { message, type: 'success' }
  })
}

showSuccess('Saved!')
showSuccess('Updated!') // Replaces the previous toast
```

## Wrapper Functions

```typescript
// toast.ts
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

type ToastType = 'info' | 'success' | 'error' | 'warning'

export function toast(message: string, type: ToastType = 'info', duration = 3000) {
  return mount(Toast, {
    singleton: true,
    props: { message, type, duration }
  })
}

export const success = (message: string) => toast(message, 'success')
export const error = (message: string) => toast(message, 'error')
export const warning = (message: string) => toast(message, 'warning')
export const info = (message: string) => toast(message, 'info')
```

### Usage

```typescript
import { success, error } from './toast'

success('Item saved successfully!')

try {
  await saveItem()
  success('Saved!')
} catch (e) {
  error('Failed to save item')
}
```

## Custom Singleton Keys

Different toast queues:

```typescript
// Error toasts (separate queue)
mount(Toast, {
  singleton: 'error-toast',
  props: { message: 'Error!', type: 'error' }
})

// Success toasts (separate queue)
mount(Toast, {
  singleton: 'success-toast',
  props: { message: 'Success!', type: 'success' }
})

// Both can show simultaneously!
```

## Persistent Toast

For toasts that need manual dismissal:

```vue
<template>
  <div v-if="visible" class="toast">
    {{ message }}
    <button @click="close">×</button>
  </div>
</template>

<script setup>
const visible = ref(true)
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
```

```typescript
// No duration - must be manually closed
const instance = mount(Toast, {
  singleton: true,
  props: { message: 'Click × to dismiss' }
})

// Close programmatically
setTimeout(() => instance.unmount(), 5000)
```

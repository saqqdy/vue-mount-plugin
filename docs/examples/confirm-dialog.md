# Confirm Dialog Example

This example shows how to create a Promise-based confirmation dialog.

## Dialog Component

```vue
<!-- ConfirmDialog.vue -->
<template>
  <div class="dialog-overlay" @click.self="cancel">
    <div class="dialog-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="buttons">
        <button class="cancel" @click="cancel">Cancel</button>
        <button class="confirm" @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Confirm' },
  message: { type: String, required: true }
})

const emit = defineEmits(['close'])

function confirm() {
  emit('close', true)
}

function cancel() {
  emit('close', false)
}
</script>

<style scoped>
.dialog-overlay {
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

.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.cancel {
  background: #ccc;
}

.confirm {
  background: #42b883;
  color: white;
}
</style>
```

## Usage

### Basic

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
    await deleteItem()
    console.log('Item deleted')
  } else {
    console.log('Cancelled')
  }
}
```

### With Event Listener

```typescript
const instance = mount(ConfirmDialog, {
  props: { message: 'Are you sure?' }
})

instance.on('close', (result) => {
  console.log('Result:', result)
})

// Or with await
const result = await instance
```

## Wrapper Composable

Create a reusable composable:

```typescript
// useConfirm.ts
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

export function useConfirm() {
  const confirm = async (message: string, title = 'Confirm'): Promise<boolean> => {
    return mount(ConfirmDialog, {
      props: { title, message }
    })
  }

  return { confirm }
}
```

### Usage

```typescript
import { useConfirm } from './useConfirm'

const { confirm } = useConfirm()

async function handleDelete() {
  const confirmed = await confirm('Delete this item?', 'Confirm Delete')

  if (confirmed) {
    await deleteItem()
  }
}
```

## Multiple Dialogs

Handle different types of confirmations:

```typescript
// Different singleton keys for different dialogs
const dangerConfirm = () => mount(ConfirmDialog, {
  singleton: 'danger-confirm',
  props: {
    title: 'Danger!',
    message: 'This action cannot be undone'
  }
})

const infoConfirm = () => mount(ConfirmDialog, {
  singleton: 'info-confirm',
  props: {
    title: 'Info',
    message: 'Continue?'
  }
})
```

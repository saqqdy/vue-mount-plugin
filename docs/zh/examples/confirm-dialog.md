# 确认对话框示例

本示例演示如何创建基于 Promise 的确认对话框。

## 对话框组件

```vue
<!-- ConfirmDialog.vue -->
<template>
  <div class="dialog-overlay" @click.self="cancel">
    <div class="dialog-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="buttons">
        <button class="cancel" @click="cancel">取消</button>
        <button class="confirm" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '确认' },
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

## 使用

### 基础用法

```typescript
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

async function handleDelete() {
  const confirmed = await mount(ConfirmDialog, {
    props: {
      title: '删除项目',
      message: '确定要删除这个项目吗？'
    }
  })

  if (confirmed) {
    await deleteItem()
    console.log('项目已删除')
  } else {
    console.log('已取消')
  }
}
```

### 带事件监听器

```typescript
const instance = mount(ConfirmDialog, {
  props: { message: '确定吗？' }
})

instance.on('close', (result) => {
  console.log('结果:', result)
})

// 或使用 await
const result = await instance
```

## 封装组合式函数

创建可复用的组合式函数：

```typescript
// useConfirm.ts
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

export function useConfirm() {
  const confirm = async (message: string, title = '确认'): Promise<boolean> => {
    return mount(ConfirmDialog, {
      props: { title, message }
    })
  }

  return { confirm }
}
```

### 使用

```typescript
import { useConfirm } from './useConfirm'

const { confirm } = useConfirm()

async function handleDelete() {
  const confirmed = await confirm('删除这个项目？', '确认删除')

  if (confirmed) {
    await deleteItem()
  }
}
```

## 多种对话框

处理不同类型的确认：

```typescript
// 不同的单例键对应不同的对话框
const dangerConfirm = () => mount(ConfirmDialog, {
  singleton: 'danger-confirm',
  props: {
    title: '危险操作！',
    message: '此操作不可撤销'
  }
})

const infoConfirm = () => mount(ConfirmDialog, {
  singleton: 'info-confirm',
  props: {
    title: '提示',
    message: '继续吗？'
  }
})
```

# 消息提示示例

本示例演示单例消息提示通知。

## Toast 组件

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
    setTimeout(() => emit('close'), 300) // 等待过渡动画
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

## 使用

### 基础用法

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

### 单例模式

同时只显示一个 toast：

```typescript
// 快速多次调用 - 只显示一个 toast
function showSuccess(message) {
  mount(Toast, {
    singleton: true,
    props: { message, type: 'success' }
  })
}

showSuccess('已保存!')
showSuccess('已更新!') // 替换之前的 toast
```

## 封装函数

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

### 使用

```typescript
import { success, error } from './toast'

success('项目保存成功!')

try {
  await saveItem()
  success('已保存!')
} catch (e) {
  error('保存项目失败')
}
```

## 自定义单例键

不同的 toast 队列：

```typescript
// 错误提示（独立队列）
mount(Toast, {
  singleton: 'error-toast',
  props: { message: '错误!', type: 'error' }
})

// 成功提示（独立队列）
mount(Toast, {
  singleton: 'success-toast',
  props: { message: '成功!', type: 'success' }
})

// 两者可以同时显示！
```

## 持久化 Toast

对于需要手动关闭的 toast：

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
// 不设置 duration - 必须手动关闭
const instance = mount(Toast, {
  singleton: true,
  props: { message: '点击 × 关闭' }
})

// 编程式关闭
setTimeout(() => instance.unmount(), 5000)
```

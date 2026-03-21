# 模态框示例

本示例演示如何创建基础弹窗组件。

## 弹窗组件

```vue
<!-- Modal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <button @click="close">关闭</button>
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

## 使用

### 基础用法

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

mount(Modal, {
  props: {
    title: 'Hello World',
    content: '这是一个弹窗对话框'
  }
})
```

### 带事件处理

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

instance.on('close', () => {
  console.log('弹窗已关闭')
})
```

### 带生命周期钩子

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  onMounted: (instance) => {
    console.log('弹窗已挂载', instance.el)
  },
  onUnmounted: () => {
    console.log('弹窗已卸载')
  }
})
```

### 自定义 z-index

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  zIndex: 2000
})
```

## 自动关闭示例

创建一个延迟后自动关闭的弹窗：

```typescript
const instance = mount(Modal, {
  props: {
    title: '自动关闭',
    content: '此弹窗将在 3 秒后关闭'
  }
})

setTimeout(() => {
  instance.unmount()
}, 3000)
```

## 链式配置

```typescript
const instance = createMount(Modal)
  .setProps({ title: '配置化弹窗' })
  .on('close', () => instance.unmount())
  .setHooks({
    onMounted: () => console.log('就绪')
  })

instance.show()
```

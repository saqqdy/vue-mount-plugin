# 基础用法

## 简单挂载

最基础的用法 - 挂载组件并立即显示：

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: {
    title: 'Hello World',
    content: '这是一个弹窗'
  }
})

// 完成后卸载
instance.unmount()
```

## 传递 Props

```typescript
mount(UserProfile, {
  props: {
    userId: 123,
    editable: true
  }
})
```

## 事件处理

### 通过 listeners 选项

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  listeners: {
    close: () => console.log('已关闭'),
    submit: (data) => console.log('已提交:', data)
  }
})
```

### 通过 on 选项（别名）

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  on: {
    close: () => console.log('已关闭')
  }
})
```

### 通过 instance.on()

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

instance.on('close', () => {
  console.log('弹窗已关闭')
})

instance.on('submit', (data) => {
  console.log('表单已提交:', data)
})
```

## Promise 支持

使用 async/await 处理对话框类组件：

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
    // 用户点击了确认
    await deleteItem()
  }
}
```

::: tip
当组件发出带有值的 `close` 事件时，Promise 会 resolve。
:::

## 单例模式

确保同一时间只有一个实例存在：

```typescript
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

// 快速多次调用 - 只显示一个 toast
function showNotification(message) {
  mount(Toast, {
    singleton: true,
    props: { message }
  })
}
```

### 自定义单例键

使用不同的键管理不同的单例组：

```typescript
// 错误提示
mount(Toast, {
  singleton: 'error-toast',
  props: { message: '错误!', type: 'error' }
})

// 成功提示（独立的单例）
mount(Toast, {
  singleton: 'success-toast',
  props: { message: '成功!', type: 'success' }
})
```

## 生命周期钩子

```typescript
mount(Modal, {
  props: { title: 'Hello' },
  onBeforeMount: (instance) => {
    console.log('即将挂载')
  },
  onMounted: (instance) => {
    console.log('已挂载')
  },
  onBeforeUnmount: (instance) => {
    console.log('即将卸载')
  },
  onUnmounted: (instance) => {
    console.log('已卸载')
  }
})
```

## 链式 API

所有 setter 方法都返回 `this`，支持链式调用：

```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .on('close', handleClose)
  .setTarget('#modal-container')
  .setHooks({ onMounted: () => console.log('就绪!') })

instance.show()
```

## 挂载目标

### 默认（document.body）

```typescript
mount(Modal) // 追加到 document.body
```

### 自定义元素

```typescript
mount(Modal, {
  target: document.getElementById('app')
})
```

### 选择器字符串

```typescript
mount(Modal, {
  target: '#modal-container'
})
```

## 自定义容器标签

默认创建 `<div>` 作为容器：

```typescript
mount(Modal, {
  tagName: 'section' // 改为创建 <section>
})
```

## z-index 控制

```typescript
mount(Modal, {
  zIndex: 2000
})
```

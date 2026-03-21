# 组合式函数

## useMount

`useMount` 组合式函数提供了便捷的方式来管理多个实例，并在 Vue 3 中自动清理。

### 基础用法

```typescript
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount, unmountAll, count, instances } = useMount()

// 挂载组件
const instance = mount(Modal, {
  props: { title: 'Hello' }
})

// 追踪活动实例
console.log(count.value) // 1
console.log(instances.value) // [instance]

// 卸载该组合式函数管理的所有实例
unmountAll()
```

### 自动清理

当使用 `useMount` 的组件卸载时，该组合式函数创建的所有实例都会自动清理：

```vue
<script setup>
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount } = useMount()

function showModal() {
  mount(Modal, { props: { title: 'Hello' } })
}
// 当此组件卸载时，弹窗会自动卸载
</script>
```

### API 参考

```typescript
interface UseMountReturn {
  // 响应式实例数组
  instances: Ref<MountInstance[]>

  // 挂载组件
  mount: <T = any>(component: any, options?: MountOptions) => MountInstance<T>

  // 卸载特定实例
  unmount: (instance: MountInstance) => void

  // 卸载所有实例
  unmountAll: () => void

  // 通过 ID 获取实例
  getById: (id: string) => MountInstance | undefined

  // 检查是否有实例
  hasInstances: () => boolean

  // 响应式实例计数
  count: Ref<number>
}
```

### 示例：Toast 管理器

```vue
<template>
  <div>
    <button @click="showToast">显示 Toast</button>
    <button @click="unmountAll">清除全部 ({{ count }})</button>
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

### 示例：弹窗栈

```vue
<template>
  <button @click="pushModal">添加弹窗</button>
  <p>打开的弹窗: {{ count }}</p>
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
      title: `弹窗 ${id}`,
      zIndex: 1000 + count.value
    }
  })

  instance.on('close', () => {
    // 实例已从 instances 数组中移除
    console.log(`弹窗 ${id} 已关闭`)
  })
}
</script>
```

## useSingleton

`useSingleton` 组合式函数为单例实例提供了便捷的接口。

### 基础用法

```typescript
import { useSingleton } from 'vue-mount-plugin'
import Toast from './Toast.vue'

const { getOrCreate } = useSingleton()

// 获取现有实例或创建新实例
const instance = getOrCreate('my-toast', Toast, {
  props: { message: 'Hello' }
})

instance.show()
```

### API 参考

```typescript
interface UseSingletonReturn {
  // 获取现有单例或创建新的
  getOrCreate: <T = any>(
    key: string,
    component: any,
    options?: MountOptions
  ) => MountInstance<T>
}
```

### 示例：全局 Toast

```vue
<template>
  <button @click="showSuccess">成功</button>
  <button @click="showError">错误</button>
</template>

<script setup>
import { useSingleton } from 'vue-mount-plugin'
import Toast from './Toast.vue'

const { getOrCreate } = useSingleton()

function showSuccess() {
  const toast = getOrCreate('toast', Toast, {
    props: { message: '成功!', type: 'success' }
  })
}

function showError() {
  const toast = getOrCreate('toast', Toast, {
    props: { message: '错误!', type: 'error' }
  })
}
</script>
```

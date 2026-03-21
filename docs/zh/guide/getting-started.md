# 快速开始

## 安装

::: code-group

```bash [pnpm]
pnpm add vue-mount-plugin
```

```bash [npm]
npm install vue-mount-plugin
```

```bash [yarn]
yarn add vue-mount-plugin
```

:::

## 快速示例

### Vue 3

```vue
<script setup>
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

function showModal() {
  mount(Modal, {
    props: { title: 'Hello World' }
  })
}
</script>

<template>
  <button @click="showModal">显示弹窗</button>
</template>
```

### Vue 2.7

```vue
<script>
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

export default {
  methods: {
    showModal() {
      mount(Modal, {
        props: { title: 'Hello World' },
        parent: this // Vue 2 中用于上下文继承
      })
    }
  }
}
</script>

<template>
  <button @click="showModal">显示弹窗</button>
</template>
```

### Vue 2.6 及更早版本

首先，安装 `@vue/composition-api`：

```bash
npm install @vue/composition-api
```

然后使用与 Vue 2.7 相同的 API。

## 浏览器中使用

```html
<head>
  <script src="//unpkg.com/vue@3"></script>
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
</head>

<script>
  const instance = VueMount.mount(MyComponent, {
    props: { title: 'Hello' }
  })
</script>
```

## 核心概念

### mount() 与 createMount()

- **`mount()`**：创建实例并立即显示（最常用）
- **`createMount()`**：仅创建实例，稍后显示（手动控制）

```typescript
// 自动显示
const instance = mount(Modal, options)

// 手动控制
const instance = createMount(Modal, options)
instance.show()    // 需要时显示
instance.hide()    // 隐藏但保留实例
instance.unmount() // 完全销毁
```

### 实例生命周期

```
createMount() → show() → mounted
                        ↓
                    hide() → hidden（实例保留）
                        ↓
                    show() → 再次 mounted
                        ↓
                    unmount() → destroyed
```

## 下一步

- [基础用法](/zh/guide/basic-usage) - 学习常见模式
- [进阶用法](/zh/guide/advanced-usage) - 探索高级功能
- [API 参考](/zh/api/) - 完整 API 文档

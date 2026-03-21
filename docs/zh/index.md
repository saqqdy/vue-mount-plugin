---
layout: home

hero:
  name: vue-mount-plugin
  text: Vue 组件挂载，简单易用
  tagline: 一个简单易用的 Vue 实例扩展插件，支持 Vue 2.0 和 Vue 3.0
  image:
    src: /logo.svg
    alt: vue-mount-plugin
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/saqqdy/vue-mount-plugin

features:
  - icon: ⚡
    title: 简洁 API
    details: 简洁的函数式 API，通过 mount() 和 createMount() 轻松挂载组件
  - icon: 🔄
    title: Vue 2 & 3 支持
    details: 通过 vue-demi 无缝支持 Vue 2.x 和 Vue 3.x
  - icon: 🎯
    title: TypeScript 优先
    details: 完整的 TypeScript 支持，提供全面的类型定义
  - icon: 🧩
    title: 单例模式
    details: 内置单例支持，确保组件实例唯一
  - icon: 📡
    title: 事件系统
    details: 实例级别的事件发射器，方便组件通信
  - icon: ⏳
    title: Promise 支持
    details: 支持 async/await，适用于对话框类组件
---

## 快速开始

### 安装

```bash
# pnpm
pnpm add vue-mount-plugin

# npm
npm install vue-mount-plugin

# yarn
yarn add vue-mount-plugin
```

### 使用

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 挂载并立即显示
const instance = mount(Modal, {
  props: { title: 'Hello World' }
})

// 完成后卸载
instance.unmount()
```

## 为什么选择 vue-mount-plugin？

- **无样板代码**：无需手动管理 DOM 元素和 Vue 实例
- **灵活控制**：精细控制组件生命周期
- **上下文继承**：Vue 3 中正确继承上下文（router、pinia、i18n）
- **自动清理**：通过 useMount 组合式函数自动清理
- **轻量级**：体积小，支持 tree-shaking

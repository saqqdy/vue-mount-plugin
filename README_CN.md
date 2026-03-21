<div style="text-align: center;" align="center">

# vue-mount-plugin

一个简单易用的 Vue 实例扩展插件，支持 Vue 2.0 和 Vue 3.0

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

**[更新日志](./CHANGELOG.md)** • **[English](./README.md)**

</div>

## 快速体验

通过 StackBlitz 在线体验：

| 框架 | 链接 |
| ---- | ---- |
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue2) |

## 安装

```bash
# 使用 pnpm
$ pnpm install vue-mount-plugin

# 使用 npm
$ npm install vue-mount-plugin --save

# 使用 yarn
$ yarn add vue-mount-plugin
```

## 使用

### 在 Vue `>=3.0` 中使用

```vue
<!-- App.vue -->
<script setup>
import { mount, createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 挂载并立即显示
const instance = mount(Modal, {
  props: { title: '你好' }
})

// 或者先创建，稍后显示
const instance2 = createMount(Modal, { props: { title: '延迟显示' } })
instance2.show()

// 完成后卸载
instance.unmount()
</script>
```

### 在 Vue `2.7` 中使用

```vue
<!-- App.vue -->
<script>
import { mount, createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

export default {
  methods: {
    showModal() {
      const instance = mount(Modal, {
        props: { title: '你好' },
        parent: this.$root
      })
    }
  }
}
</script>
```

### 在 Vue `<=2.6` 中使用

> 将 `@vue/composition-api` 添加到 `package.json` 依赖中并运行安装。

```json
{
  "dependencies": {
    "@vue/composition-api": "latest"
  }
}
```

### 在浏览器中使用

```html
<head>
  <!-- 引入 vue3 或 vue2 -->
  <script src="//unpkg.com/vue@3"></script>
  <!-- 引入 vue-mount-plugin 库 -->
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
</head>
```

```html
<script>
  // 全局变量: VueMount.mount, VueMount.createMount 等
  const instance = VueMount.mount(DemoVue, { props: { title: '你好' } })
  instance.unmount()
</script>
```

## API

### 核心函数

| 函数 | 描述 |
|------|------|
| `mount(component, options?)` | 创建并立即显示组件 |
| `createMount(component, options?)` | 创建实例但不显示（手动控制） |

### 挂载选项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `props` | `object` | - | 传递给组件的 props |
| `target` | `Element \| string` | - | 挂载目标元素或选择器 |
| `tagName` | `string` | `'div'` | 自动创建的容器标签名 |
| `app` | `App` | - | Vue 3 应用实例（用于上下文继承） |
| `parent` | `unknown` | - | 父组件实例（Vue 2） |
| `context` | `object` | - | Vue 2 上下文（router, store, i18n） |
| `listeners` | `Listeners` | - | 事件监听器对象 |
| `on` | `Listeners` | - | 事件监听器（别名） |
| `slots` | `Slots` | - | 插槽对象 |
| `singleton` | `boolean \| string` | - | 单例模式 |
| `zIndex` | `number` | - | z-index 层级 |

### 生命周期钩子

| 钩子 | 描述 |
|------|------|
| `onBeforeMount` | 组件挂载前调用 |
| `onMounted` | 组件挂载后调用 |
| `onBeforeUnmount` | 组件卸载前调用 |
| `onUnmounted` | 组件卸载后调用 |

### 实例方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `show()` | `this` | 显示/挂载组件 |
| `hide()` | `this` | 隐藏组件（保留实例） |
| `unmount()` | `void` | 卸载并完全销毁 |
| `destroy()` | `void` | `unmount()` 的别名 |
| `remove()` | `void` | `unmount()` 的别名 |
| `setProps(props)` | `this` | 更新 props（支持链式调用） |
| `setTarget(target)` | `this` | 设置挂载目标（支持链式调用） |
| `setSlots(slots)` | `this` | 设置插槽（支持链式调用） |
| `setHooks(hooks)` | `this` | 设置生命周期钩子（支持链式调用） |
| `on(event, handler)` | `this` | 添加事件监听器（支持链式调用） |
| `off(event, handler?)` | `this` | 移除事件监听器（支持链式调用） |
| `emit(event, ...args)` | `this` | 触发事件（支持链式调用） |

### 实例属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | `string` | 唯一实例 ID |
| `mounted` | `boolean` | 组件是否已挂载 |
| `el` | `HTMLElement \| null` | DOM 元素 |
| `vm` | `ComponentPublicInstance \| null` | Vue 组件实例 |
| `options` | `MountOptions` | 合并后的选项 |

### 全局函数

| 函数 | 描述 |
|------|------|
| `getInstances()` | 获取所有活动实例 |
| `getInstanceById(id)` | 根据 ID 获取实例 |
| `unmountAll()` | 卸载所有实例 |
| `isMounted(id)` | 检查实例是否已挂载 |
| `getActiveInstanceIds()` | 获取所有活动实例 ID |
| `setGlobalConfig(config)` | 设置全局配置 |
| `globalConfig` | 全局配置对象 |

## 使用示例

### 基础用法

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 挂载并立即显示
const instance = mount(Modal, {
  props: { title: '你好世界' }
})

// 完成后卸载
instance.unmount()
```

### Promise 支持

```typescript
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from './ConfirmDialog.vue'

// 等待用户确认
const result = await mount(ConfirmDialog, {
  props: {
    message: '确定要继续吗？'
  }
})

console.log(result ? '已确认' : '已取消')
```

> 当组件触发 `close` 事件时，Promise 会 resolve。

### 单例模式

```typescript
import { mount } from 'vue-mount-plugin'
import Toast from './Toast.vue'

// 同一时间只存在一个 toast 实例
mount(Toast, {
  singleton: true,
  props: { message: '你好!' }
})

// 使用自定义 key 区分不同的单例组
mount(Toast, {
  singleton: 'error-toast',
  props: { message: '错误!', type: 'error' }
})
```

### 事件系统

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal)

// 监听事件
instance.on('submit', (data) => {
  console.log('已提交:', data)
})

// 链式调用
instance
  .on('close', () => console.log('已关闭'))
  .on('error', (err) => console.error(err))
```

### 生命周期钩子

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = createMount(Modal, {
  onBeforeMount: (instance) => {
    console.log('即将挂载')
  },
  onMounted: (instance) => {
    console.log('已挂载', instance.el)
  },
  onBeforeUnmount: (instance) => {
    console.log('即将卸载')
  },
  onUnmounted: (instance) => {
    console.log('已卸载')
  }
})

instance.show()
```

### 手动控制

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 创建但不显示
const instance = createMount(Modal, {
  props: { title: '手动控制' }
})

console.log(instance.mounted) // false

// 需要时显示
instance.show()
console.log(instance.mounted) // true

// 隐藏但保留实例
instance.hide()
console.log(instance.mounted) // true（仍在追踪）

// 完全销毁
instance.unmount()
console.log(instance.mounted) // false
```

### Props 更新

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: { title: '原标题' }
})

// 动态更新 props
instance.setProps({ title: '已更新!' })

// 与其他方法链式调用
instance
  .setProps({ loading: true })
  .setProps({ loading: false, title: '完成' })
```

### 上下文继承（Vue 3）

```typescript
import { mount } from 'vue-mount-plugin'
import { getCurrentInstance } from 'vue'
import Modal from './Modal.vue'

// 在 Vue 3 中，传递 app 以继承上下文
const { appContext } = getCurrentInstance()!

const instance = mount(Modal, {
  app: appContext.app,
  props: { title: '带上下文' }
})

// 组件现在可以使用 router、store、i18n 等
```

### useMount 组合式函数

```typescript
import { useMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const { mount, unmountAll, count, instances } = useMount()

// 挂载组件（组件卸载时自动清理）
const instance = mount(Modal, { props: { title: '你好' } })

// 追踪活动实例
console.log(count.value) // 1
console.log(instances.value) // [instance]

// 一次性卸载所有
unmountAll()
```

### Vue 插件

```typescript
import { createApp } from 'vue'
import { MountPlugin } from 'vue-mount-plugin'
import App from './App.vue'

const app = createApp(App)

// 使用默认名称安装（$show）
app.use(MountPlugin, { zIndex: 2000 })

// 或使用自定义名称
app.use(MountPlugin, { name: '$mount' })

// 现在可在模板中使用
// this.$show(Component, options)
```

## 从 v3.x 升级到 v4.0

### 概述

v4.0 是一次重大重写，采用了更简洁的函数式 API。本指南将帮助你从 v3.x 迁移。

### 快速迁移清单

- [ ] 将 `new Mount()` 替换为 `mount()` 或 `createMount()`
- [ ] 更新属性名称（`id` 现在是字符串，`componentInstance` → `vm`）
- [ ] 更新方法调用（`.mount()` → `.show()`）
- [ ] 更新静态方法调用（`.instances` → `getInstances()`）
- [ ] 如果使用 CDN，更新构建文件路径

### API 变更

#### 核心 API

| v3.x | v4.0 | 说明 |
|------|------|------|
| `new Mount(component, options)` | `mount(component, options)` | 创建并立即显示 |
| `new Mount(component, options)` | `createMount(component, options)` | 仅创建，手动显示 |
| `instance.mount()` | `instance.show()` | 方法重命名 |
| `instance.destroy()` | `instance.unmount()` | 方法重命名（别名仍可用） |
| `instance.remove()` | `instance.unmount()` | 别名仍然有效 |

#### 实例属性

| v3.x | v4.0 | 说明 |
|------|------|------|
| `instance.id` (number) | `instance.id` (string) | 现为字符串，唯一性更好 |
| `instance.componentInstance` | `instance.vm` | 重命名以保持一致性 |
| `instance.vNode` | - | 已移除，使用 `instance.vm` |
| `instance.target` | `instance.el` | 重命名 |
| - | `instance.mounted` | 新增：布尔状态 |

#### 静态方法 → 函数

| v3.x | v4.0 |
|------|------|
| `Mount.instances` | `getInstances()` |
| `Mount.getById(id)` | `getInstanceById(id)` |
| `Mount.unmountAll()` | `unmountAll()` |
| `Mount.destroyAll()` | `unmountAll()` |

#### 选项变更

| v3.x | v4.0 | 说明 |
|------|------|------|
| `parent` | `parent` | 仍支持（Vue 2） |
| - | `app` | 新增：Vue 3 上下文继承 |
| - | `singleton` | 新增：单例模式 |
| - | `onBeforeMount` | 新增：生命周期钩子 |
| - | `onMounted` | 新增：生命周期钩子 |
| - | `onBeforeUnmount` | 新增：生命周期钩子 |
| - | `onUnmounted` | 新增：生命周期钩子 |

### 代码迁移示例

#### 基础用法

```typescript
// ❌ v3.x
import Mount from 'vue-mount-plugin'
const instance = new Mount(Modal, { parent: this.$root })
instance.mount()
instance.unmount()

// ✅ v4.0
import { mount } from 'vue-mount-plugin'
const instance = mount(Modal, { app: this.$root })
instance.unmount()
```

#### 延迟挂载

```typescript
// ❌ v3.x
import Mount from 'vue-mount-plugin'
const instance = new Mount(Modal, options)
// ... 稍后
instance.mount()

// ✅ v4.0
import { createMount } from 'vue-mount-plugin'
const instance = createMount(Modal, options)
// ... 稍后
instance.show()
```

#### 实例管理

```typescript
// ❌ v3.x
const all = Mount.instances
const found = Mount.getById(1)
Mount.unmountAll()

// ✅ v4.0
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'
const all = getInstances()
const found = getInstanceById('mount-1-xxx')
unmountAll()
```

#### 访问组件实例

```typescript
// ❌ v3.x
const instance = new Mount(Modal)
instance.mount()
console.log(instance.componentInstance)

// ✅ v4.0
const instance = mount(Modal)
console.log(instance.vm)
```

#### 事件监听器

```typescript
// ❌ v3.x
const instance = new Mount(Modal, {
  listeners: { close: handleClose }
})
instance.mount()

// ✅ v4.0 - 方式 1：通过选项
const instance = mount(Modal, {
  listeners: { close: handleClose }
})

// ✅ v4.0 - 方式 2：通过方法（新增！）
const instance = mount(Modal)
instance.on('close', handleClose)
```

#### 链式调用

```typescript
// ❌ v3.x
const instance = new Mount(Modal)
  .setProps({ title: '你好' })
  .setTarget('#container')
  .mount()

// ✅ v4.0
const instance = createMount(Modal)
  .setProps({ title: '你好' })
  .setTarget('#container')
  .show()
```

### v4.0 新功能

#### 1. 单例模式

同一时间只存在一个组件实例：

```typescript
import { mount } from 'vue-mount-plugin'

// 多次调用 - 只显示一个 toast
mount(Toast, {
  singleton: true,
  props: { message: '你好' }
})
```

#### 2. Promise 支持

等待用户交互结果：

```typescript
import { mount } from 'vue-mount-plugin'

const confirmed = await mount(ConfirmDialog, {
  props: { message: '确定要继续吗？' }
})

if (confirmed) {
  // 用户点击了确认
}
```

#### 3. hide() 方法

隐藏但不销毁：

```typescript
import { mount } from 'vue-mount-plugin'

const instance = mount(Modal)
instance.hide()    // 隐藏但保留实例
instance.show()    // 再次显示
instance.unmount() // 完全销毁
```

#### 4. useMount 组合式函数

Vue 3 组件中自动清理：

```typescript
import { useMount } from 'vue-mount-plugin'

const { mount, unmountAll, count } = useMount()

// 组件卸载时实例自动清理
const instance = mount(Modal)
```

#### 5. 全局配置

为所有实例设置默认值：

```typescript
import { setGlobalConfig, globalConfig } from 'vue-mount-plugin'

setGlobalConfig({ zIndex: 2000 })

// 所有实例继承此配置
mount(Modal) // zIndex: 2000
```

### 构建输出变更

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | 已移除 |
| `dist/index.global.prod.js` | 已移除 |

### CDN 迁移

```html
<!-- ❌ v3.x -->
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>

<!-- ✅ v4.0 -->
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

### Node.js 版本

最低 Node.js 版本：`>=14.14.0`（原 `>=12.20`）

### 迁移脚本

对于大型项目，可以使用以下正则替换指南：

| 查找 | 替换 |
|------|------|
| `new Mount\(([^)]+)\)` | `mount($1)` |
| `\.mount\(\)` | `.show()` |
| `Mount\.instances` | `getInstances()` |
| `Mount\.getById\(([^)]+)\)` | `getInstanceById($1)` |
| `Mount\.unmountAll\(\)` | `unmountAll()` |
| `\.componentInstance` | `.vm` |
| `\.target` | `.el` |

## 构建输出

| 文件 | 格式 | 描述 |
|------|------|------|
| `index.mjs` | ESM | 适用于打包工具的 ES Module |
| `index.cjs` | CJS | 适用于 Node.js 的 CommonJS |
| `index.iife.js` | IIFE | 浏览器版本 |
| `index.iife.min.js` | IIFE | 浏览器版本（压缩） |
| `index.es5.js` | UMD | ES5 兼容版本 |
| `index.es5.min.js` | UMD | ES5 兼容版本（压缩） |

## 支持与问题

请在 [这里](https://github.com/saqqdy/vue-mount-plugin/issues) 提交 issue。

## 许可证

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/vue-mount-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/vue-mount-plugin
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/vue-mount-plugin/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/vue-mount-plugin&utm_campaign=Badge_Grade
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/vue-mount-plugin.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/vue-mount-plugin?branch=master
[download-image]: https://img.shields.io/npm/dm/vue-mount-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/vue-mount-plugin
[gzip-image]: http://img.badgesize.io/https://unpkg.com/vue-mount-plugin/dist/index.iife.min.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/vue-mount-plugin/dist/index.iife.min.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_vue-mount-plugin
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_vue-mount-plugin

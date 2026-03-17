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

**[文档](https://www.saqqdy.com/vue-mount-plugin)** • **[更新日志](./CHANGELOG.md)** • **[English](./README.md)**

</div>

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
<!-- test.vue -->
<script setup>
import { getCurrentInstance } from 'vue'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

const { proxy } = getCurrentInstance()
const instance = new Mount(DemoVue, { parent: proxy.$root })

// 挂载到 document.body 末尾
instance.mount()

// 卸载
instance.unmount()
</script>
```

### 在 Vue `2.7` 中使用

```vue
<!-- test.vue -->
<script>
import { getCurrentInstance } from 'vue'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const instance = new Mount(DemoVue, { parent: proxy.$root })

    // 挂载到 document.body 末尾
    instance.mount()

    // 卸载
    instance.unmount()
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

```vue
<!-- test.vue -->
<script>
import { getCurrentInstance } from '@vue/composition-api'
import Mount from 'vue-mount-plugin'
import DemoVue from './demo.vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const instance = new Mount(DemoVue, { parent: proxy.$root })

    // 挂载到 document.body 末尾
    instance.mount()

    // 卸载
    instance.unmount()
  }
}
</script>
```

### 在浏览器中使用

直接通过浏览器 HTML 标签引入 `vue-mount-plugin`，使用全局变量 `VueMount`。

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
  const instance = new VueMount(DemoVue, { parent: this.$root })

  // 挂载到 document.body 末尾
  instance.mount()

  // 卸载
  instance.unmount()
</script>
```

### ES5 支持

对于旧版浏览器（IE11），请使用 ES5 构建版本：

```html
<head>
  <!-- 引入 vue2（Vue 3 不支持 IE11） -->
  <script src="//unpkg.com/vue@2"></script>
  <!-- 引入 vue-mount-plugin ES5 版本 -->
  <script src="//unpkg.com/vue-mount-plugin@4/dist/index.es5.min.js"></script>
</head>
```

## API

### 构造函数

```typescript
new Mount(component, options?)
```

#### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `component` | `Component` | 要挂载的 Vue 组件（支持异步组件） |
| `options` | `Options` | 挂载选项（可选） |

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `app` | `App` | - | Vue 3 应用实例 |
| `children` | `unknown` | - | VNode 的子节点 |
| `context` | `object` | - | Vue 2 上下文（router, store, i18n） |
| `parent` | `unknown` | - | 父组件实例 |
| `props` | `object` | - | 传递给组件的 props |
| `target` | `Element \| string` | - | 挂载目标元素或选择器 |
| `tagName` | `string` | `'div'` | 自动创建的容器标签名 |
| `listeners` | `Listeners` | - | 事件监听器对象 |
| `on` | `Listeners` | - | 事件监听器（别名） |
| `slots` | `Slots` | - | 插槽对象 |
| `ref` | `Ref` | - | 用于获取组件实例的 ref |
| `keepAlive` | `KeepAliveOptions \| boolean` | - | KeepAlive 配置 |

#### 生命周期钩子

| 钩子 | 描述 |
|------|------|
| `onBeforeMount` | 组件挂载前调用 |
| `onMounted` | 组件挂载后调用 |
| `onBeforeUnmount` | 组件卸载前调用 |
| `onUnmounted` | 组件卸载后调用 |

### 实例方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `mount()` | `this` | 将组件挂载到 DOM |
| `unmount()` | `void` | 卸载并销毁组件 |
| `destroy()` | `void` | `unmount()` 的别名 |
| `remove()` | `void` | `unmount()` 的别名 |
| `setProps(props)` | `this` | 设置 props（支持链式调用） |
| `setListeners(listeners)` | `this` | 设置事件监听器（支持链式调用） |
| `on(listeners)` | `this` | `setListeners()` 的别名 |
| `setSlots(slots)` | `this` | 设置插槽（支持链式调用） |
| `setTarget(target)` | `this` | 设置挂载目标（支持链式调用） |
| `setHooks(hooks)` | `this` | 设置生命周期钩子（支持链式调用） |

### 实例属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | `number` | 唯一实例 ID（只读） |
| `vNode` | `VNode` | Vue 虚拟节点 |
| `target` | `Element` | 挂载目标元素 |
| `componentInstance` | `ComponentPublicInstance` | 挂载后的组件实例 |

### 静态方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `Mount.instances` | `Mount[]` | 获取所有活动实例 |
| `Mount.unmountAll()` | `void` | 卸载所有实例 |
| `Mount.destroyAll()` | `void` | `unmountAll()` 的别名 |
| `Mount.getById(id)` | `Mount \| undefined` | 根据 ID 获取实例 |

## 使用示例

### 生命周期钩子

```typescript
const instance = new Mount(DemoVue, {
  onBeforeMount: (instance) => {
    console.log('即将挂载', instance.id)
  },
  onMounted: (instance) => {
    console.log('已挂载', instance.componentInstance)
  },
  onBeforeUnmount: (instance) => {
    console.log('即将卸载')
  },
  onUnmounted: (instance) => {
    console.log('已卸载')
  }
})
instance.mount()
```

### 事件监听器

```typescript
const instance = new Mount(DemoVue, {
  listeners: {
    click: (event) => console.log('点击了!', event),
    close: () => instance.unmount()
  }
})
// 或者使用 'on' 别名
const instance2 = new Mount(DemoVue, {
  on: {
    submit: (data) => console.log('提交了:', data)
  }
})
```

### 插槽

```typescript
const instance = new Mount(ModalComponent, {
  slots: {
    default: [h('p', '模态框内容')],
    header: [h('h2', '标题')],
    footer: [h('button', '关闭')]
  }
})
```

### Ref 访问

```typescript
import { ref } from 'vue'

const componentRef = ref(null)
const instance = new Mount(DemoVue, { ref: componentRef })

instance.mount()
// 访问组件实例
console.log(componentRef.value) // ComponentPublicInstance
```

### 异步组件

```typescript
// 使用动态导入的异步组件
const instance = new Mount(
  () => import('./HeavyComponent.vue'),
  { parent: proxy.$root }
)
instance.mount()
```

### 链式调用

```typescript
const instance = new Mount(DemoVue)
  .setProps({ title: '你好' })
  .setListeners({ click: handleClick })
  .setTarget('#modal-container')
  .setHooks({ onMounted: () => console.log('准备好了!') })
  .mount()
```

### 实例管理

```typescript
// 获取所有活动实例
const allInstances = Mount.instances
console.log(`活动实例数: ${allInstances.length}`)

// 根据 ID 获取特定实例
const instance = Mount.getById(1)

// 一次性卸载所有实例
Mount.unmountAll()
```

## 从 v3.x 升级到 v4.0

### 破坏性变更

#### 1. 构建输出文件名

如果你直接引用构建文件，请更新路径：

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | 已移除 |
| `dist/index.global.prod.js` | 已移除 |

#### 2. Node.js 版本

最低 Node.js 版本从 `>=12.20` 提升到 `>=14.14.0`。

#### 3. CDN 链接

更新你的 CDN 链接：

```html
<!-- v3.x -->
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>

<!-- v4.0 -->
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

### 新功能（可选使用）

v4.0 引入了多个向后兼容的新功能：

```typescript
// 生命周期钩子
const instance = new Mount(Component, {
  onBeforeMount: (instance) => console.log('即将挂载'),
  onMounted: (instance) => console.log('已挂载'),
})

// 事件监听器
const instance = new Mount(Component, {
  listeners: { click: handleClick },
  // 或
  on: { click: handleClick },
})

// Ref 支持
const ref = { value: null }
new Mount(Component, { ref })

// 链式 API
new Mount(Component)
  .setProps({ title: '你好' })
  .setTarget('#container')
  .mount()

// 实例管理
const allInstances = Mount.instances
Mount.unmountAll()
const instance = Mount.getById(1)
```

### 无需修改代码

如果你只使用基础 API，无需修改代码：

```typescript
// v4.0 中仍然有效
const instance = new Mount(Component, { parent: this.$root })
instance.mount()
instance.unmount()
```

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

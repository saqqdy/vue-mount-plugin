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
  <script src="//unpkg.com/vue-mount-plugin@3/dist/index.iife.min.js"></script>
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
  <script src="//unpkg.com/vue-mount-plugin@3/dist/index.es5.min.js"></script>
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
| `component` | `Component` | 要挂载的 Vue 组件 |
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

### 方法

| 方法 | 描述 |
|------|------|
| `mount()` | 将组件挂载到 DOM |
| `unmount()` | 卸载并销毁组件 |

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

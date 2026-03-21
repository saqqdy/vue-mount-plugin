# 从 v3.x 迁移到 v4.0

本指南帮助你从 vue-mount-plugin v3.x 迁移到 v4.0。

## 概览

v4.0 是一次重大重写，采用了更简洁的函数式 API。主要变化是从基于类的 API 改为基于函数的 API。

## 快速迁移清单

- [ ] 将 `new Mount()` 替换为 `mount()` 或 `createMount()`
- [ ] 更新属性名（`id` 现在是字符串，`componentInstance` → `vm`）
- [ ] 更新方法调用（`.mount()` → `.show()`）
- [ ] 更新静态方法调用（`Mount.instances` → `getInstances()`）
- [ ] 如果使用 CDN，更新构建文件路径

## 破坏性变更

### API 变更：类 → 函数

**v3.x**
```typescript
import Mount from 'vue-mount-plugin'

const instance = new Mount(Component, options)
instance.mount()
```

**v4.0**
```typescript
import { mount, createMount } from 'vue-mount-plugin'

// 创建并立即显示
const instance = mount(Component, options)

// 或仅创建，稍后显示
const instance = createMount(Component, options)
instance.show()
```

### 方法重命名

**v3.x**
```typescript
instance.mount()    // 显示组件
```

**v4.0**
```typescript
instance.show()     // 显示组件
```

### 属性变更

| v3.x | v4.0 | 说明 |
|------|------|------|
| `instance.id`（数字） | `instance.id`（字符串） | 现在是字符串以提供更好的唯一性 |
| `instance.componentInstance` | `instance.vm` | 重命名 |
| `instance.vNode` | - | 已移除 |
| `instance.target` | `instance.el` | 重命名 |
| - | `instance.mounted` | 新增：布尔状态 |

### 静态方法 → 函数

**v3.x**
```typescript
Mount.instances
Mount.getById(1)
Mount.unmountAll()
```

**v4.0**
```typescript
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'

getInstances()
getInstanceById('mount-1-xxx')
unmountAll()
```

## 代码迁移示例

### 基础用法

**v3.x**
```typescript
import Mount from 'vue-mount-plugin'

const instance = new Mount(Modal, { parent: this.$root })
instance.mount()
instance.unmount()
```

**v4.0**
```typescript
import { mount } from 'vue-mount-plugin'

const instance = mount(Modal, { app: this.$root })
instance.unmount()
```

### 延迟挂载

**v3.x**
```typescript
const instance = new Mount(Modal, options)
// ... 稍后
instance.mount()
```

**v4.0**
```typescript
import { createMount } from 'vue-mount-plugin'

const instance = createMount(Modal, options)
// ... 稍后
instance.show()
```

### 实例管理

**v3.x**
```typescript
const all = Mount.instances
const found = Mount.getById(1)
Mount.unmountAll()
```

**v4.0**
```typescript
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'

const all = getInstances()
const found = getInstanceById('mount-1-xxx')
unmountAll()
```

### 访问组件实例

**v3.x**
```typescript
const instance = new Mount(Modal)
instance.mount()
console.log(instance.componentInstance)
```

**v4.0**
```typescript
const instance = mount(Modal)
console.log(instance.vm)
```

### 事件监听器

**v3.x**
```typescript
const instance = new Mount(Modal, {
  listeners: { close: handleClose }
})
instance.mount()
```

**v4.0 - 选项 1**
```typescript
const instance = mount(Modal, {
  listeners: { close: handleClose }
})
```

**v4.0 - 选项 2（新！）**
```typescript
const instance = mount(Modal)
instance.on('close', handleClose)
```

### 链式 API

**v3.x**
```typescript
const instance = new Mount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .mount()
```

**v4.0**
```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .show()
```

## v4.0 新功能

### 单例模式

```typescript
mount(Toast, {
  singleton: true,
  props: { message: 'Hello' }
})
```

### Promise 支持

```typescript
const result = await mount(ConfirmDialog, {
  props: { message: '确定吗？' }
})
```

### hide() 方法

```typescript
const instance = mount(Modal)
instance.hide()    // 隐藏但保留实例
instance.show()    // 再次显示
```

### useMount 组合式函数

```typescript
const { mount, unmountAll, count } = useMount()
const instance = mount(Modal) // 卸载时自动清理
```

### 全局配置

```typescript
setGlobalConfig({ zIndex: 2000 })
mount(Modal) // 使用全局配置
```

## 构建输出变更

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | 已移除 |
| `dist/index.global.prod.js` | 已移除 |

## CDN 迁移

**v3.x**
```html
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>
```

**v4.0**
```html
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

## Node.js 版本

最低 Node.js 版本：`>=14.14.0`（之前是 `>=12.20`）

## 迁移脚本

大型项目可使用这些正则替换：

| 查找 | 替换 |
|------|------|
| `new Mount\(([^)]+)\)` | `mount($1)` |
| `\.mount\(\)` | `.show()` |
| `Mount\.instances` | `getInstances()` |
| `Mount\.getById\(([^)]+)\)` | `getInstanceById($1)` |
| `Mount\.unmountAll\(\)` | `unmountAll()` |
| `\.componentInstance` | `.vm` |
| `\.target` | `.el` |

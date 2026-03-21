# vueMount API 设计文档

## 需求概述

实现一个 `vueMount` 方法，API 设计如下：

```ts
vueMount({
  mountTarget: '',      // 挂载目标容器
  component: Component, // Vue 组件
  componentOptions: {   // 组件配置（props 等）
    value: ''
  }
})
```

**核心需求：**

1. **上下文继承** - 被挂载的组件能访问父组件的上下文（`$router`、`$store`、`$i18n` 等）
2. **Props 传递** - `componentOptions` 作为 props 传递给子组件
3. **灵活挂载** - 可指定挂载到 `mountTarget` 容器，不指定时挂载到 body 末尾

---

## 实现方式分析

### 方式一：通过 App Context 传递（Vue 3 推荐）

```ts
// Vue 3 实现
import { createVNode, render, type App, type Component } from 'vue'

interface VueMountOptions {
  mountTarget?: string | Element
  component: Component
  componentOptions?: Record<string, any>
  app?: App  // 传入父组件的 app 实例
}

export function vueMount(options: VueMountOptions) {
  const { mountTarget, component, componentOptions, app } = options

  // 创建挂载容器
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget || document.createElement('div')

  // 创建容器元素（如果不存在）
  let shouldAppend = false
  let targetEl: Element
  if (!mountTarget) {
    targetEl = document.createElement('div')
    shouldAppend = true
  } else if (typeof mountTarget === 'string') {
    targetEl = document.querySelector(mountTarget) || document.createElement('div')
    shouldAppend = !document.querySelector(mountTarget)
  } else {
    targetEl = mountTarget
  }

  // 创建虚拟节点
  const vnode = createVNode(component, componentOptions)

  // 关键：继承 app 上下文，这样组件就能访问 $router, $store 等
  if (app?._context) {
    vnode.appContext = app._context
  }

  // 挂载
  shouldAppend && document.body.appendChild(targetEl)
  render(vnode, targetEl)

  // 返回卸载方法
  return {
    unmount: () => {
      render(null, targetEl)
      shouldAppend && document.body.removeChild(targetEl)
    },
    vnode,
    container: targetEl
  }
}
```

**优点：**
- Vue 3 官方推荐方式
- 完整继承 `appContext`，包括全局组件、指令、插件（router、store、i18n）
- 性能好，无需创建新的 App 实例

**缺点：**
- 需要传入 `app` 实例
- Vue 2 不适用

---

### 方式二：通过 provide/inject 传递上下文

```ts
// Vue 3 实现
import { createVNode, render, type App, type Component, inject } from 'vue'

interface VueMountOptions {
  mountTarget?: string | Element
  component: Component
  componentOptions?: Record<string, any>
  provides?: Record<string, any>  // 手动传入 provides
}

export function vueMount(options: VueMountOptions) {
  const { mountTarget, component, componentOptions, provides } = options

  // ...容器创建逻辑同上

  const vnode = createVNode(component, componentOptions)

  // 手动设置 provides
  if (provides) {
    vnode.appContext = {
      config: {},
      provides,
      // ...其他必要属性
    } as any
  }

  render(vnode, targetEl)

  return { unmount: () => render(null, targetEl) }
}
```

**优点：**
- 更精细的控制
- 可以选择性传递上下文

**缺点：**
- 需要手动收集 provides
- 丢失全局组件、指令等

---

### 方式三：创建独立 App 实例（适用于独立弹窗）

```ts
import { createApp, type Component } from 'vue'
import router from './router'
import store from './store'

interface VueMountOptions {
  mountTarget?: string | Element
  component: Component
  componentOptions?: Record<string, any>
  plugins?: Array<{ plugin: any; options?: any }>
}

export function vueMount(options: VueMountOptions) {
  const { mountTarget, component, componentOptions, plugins = [] } = options

  // 创建容器
  const targetEl = mountTarget
    ? (typeof mountTarget === 'string' ? document.querySelector(mountTarget) : mountTarget)
    : document.createElement('div')

  !mountTarget && document.body.appendChild(targetEl)

  // 创建独立 App 实例
  const app = createApp(component, componentOptions)

  // 注册插件
  plugins.forEach(({ plugin, options }) => {
    app.use(plugin, options)
  })

  const instance = app.mount(targetEl)

  return {
    unmount: () => {
      app.unmount()
      !mountTarget && document.body.removeChild(targetEl)
    },
    instance,
    app
  }
}
```

**优点：**
- 完全独立，不影响主应用
- 适合独立弹窗、全局通知等场景

**缺点：**
- 每次创建新实例，有一定开销
- 上下文不共享（需要手动注册插件）

---

### 方式四：Vue 2 实现（基于 Vue.extend）

```ts
// Vue 2 实现
import Vue from 'vue'

interface VueMountOptions {
  mountTarget?: string | Element
  component: any
  componentOptions?: Record<string, any>
  parent?: Vue  // 父组件实例
}

export function vueMount(options: VueMountOptions) {
  const { mountTarget, component, componentOptions, parent } = options

  // 创建容器
  const targetEl = mountTarget
    ? (typeof mountTarget === 'string' ? document.querySelector(mountTarget) : mountTarget)
    : document.createElement('div')

  !mountTarget && document.body.appendChild(targetEl)

  // 创建子类
  const ComponentClass = Vue.extend(component)

  // 创建实例，设置 parent 以继承上下文
  const instance = new ComponentClass({
    propsData: componentOptions,
    parent: parent  // 关键：设置 parent 访问 $router, $store
  })

  instance.$mount(targetEl)

  return {
    unmount: () => {
      instance.$destroy()
      !mountTarget && document.body.removeChild(instance.$el)
    },
    instance
  }
}
```

**优点：**
- Vue 2 官方推荐方式
- 通过 `parent` 可继承 `$router`、`$store`

**缺点：**
- Vue 2 特有 API，Vue 3 不兼容
- 需要传入父组件实例

---

## 推荐方案：统一 API + 多策略实现

结合上述分析，推荐采用统一 API，内部根据 Vue 版本选择不同策略：

```ts
// src/vueMount.ts
import { isVue2, Vue2 } from 'vue-demi'
import { createVNode, render } from 'vue-demi'
import type { Component, App } from 'vue-demi'

export interface VueMountOptions {
  /** 挂载目标，CSS 选择器或 DOM 元素，不指定则挂载到 body */
  mountTarget?: string | Element
  /** Vue 组件 */
  component: Component
  /** 组件 props */
  componentOptions?: Record<string, any>
  /** Vue 3: 传入 app 实例以继承上下文 */
  app?: App
  /** Vue 2: 传入父组件实例以继承上下文 */
  parent?: any
}

export interface VueMountResult {
  /** 卸载组件 */
  unmount: () => void
  /** 更新组件 props */
  update: (newProps: Record<string, any>) => void
  /** 虚拟节点 / 组件实例 */
  instance: any
  /** 挂载容器 */
  container: Element
}

export function vueMount(options: VueMountOptions): VueMountResult {
  const { mountTarget, component, componentOptions = {}, app, parent } = options

  // 1. 处理挂载容器
  const { container, shouldAppend } = resolveContainer(mountTarget)

  // 2. 根据版本选择挂载策略
  if (isVue2) {
    return mountVue2(component, componentOptions, container, shouldAppend, parent)
  } else {
    return mountVue3(component, componentOptions, container, shouldAppend, app)
  }
}

function resolveContainer(mountTarget?: string | Element) {
  let container: Element
  let shouldAppend = false

  if (!mountTarget) {
    container = document.createElement('div')
    shouldAppend = true
  } else if (typeof mountTarget === 'string') {
    const found = document.querySelector(mountTarget)
    if (found) {
      container = found
    } else {
      container = document.createElement('div')
      shouldAppend = true
    }
  } else {
    container = mountTarget
  }

  return { container, shouldAppend }
}

// Vue 3 实现
function mountVue3(
  component: Component,
  props: Record<string, any>,
  container: Element,
  shouldAppend: boolean,
  app?: App
): VueMountResult {
  const vnode = createVNode(component, props)

  // 继承上下文
  if (app?._context) {
    vnode.appContext = app._context
  }

  shouldAppend && document.body.appendChild(container)
  render(vnode, container)

  return {
    unmount: () => {
      render(null, container)
      shouldAppend && document.body.removeChild(container)
    },
    update: (newProps) => {
      const merged = { ...props, ...newProps }
      const newVnode = createVNode(component, merged)
      if (app?._context) newVnode.appContext = app._context
      render(newVnode, container)
    },
    instance: vnode.component,
    container
  }
}

// Vue 2 实现
function mountVue2(
  component: any,
  props: Record<string, any>,
  container: Element,
  shouldAppend: boolean,
  parent?: any
): VueMountResult {
  const ComponentClass = Vue2.extend(component)

  const instance = new ComponentClass({
    propsData: props,
    parent: parent?._isVue ? parent : undefined
  })

  shouldAppend && document.body.appendChild(container)
  instance.$mount(container)

  return {
    unmount: () => {
      instance.$destroy()
      shouldAppend && document.body.removeChild(instance.$el)
    },
    update: (newProps) => {
      Object.assign(instance.$props, newProps)
    },
    instance,
    container
  }
}
```

---

## 功能扩展建议

### 1. 生命周期钩子

```ts
interface VueMountOptions {
  // ...其他选项
  onMounted?: (instance: any) => void
  onBeforeUnmount?: (instance: any) => void
}

// 实现中触发钩子
if (onMounted) {
  nextTick(() => onMounted(instance))
}
```

### 2. 过渡动画支持

```ts
interface VueMountOptions {
  // ...其他选项
  transition?: {
    name: string
    appear?: boolean
  }
}

// 包裹 Transition 组件
const wrapperComponent = {
  render() {
    return h(Transition, { name: transition?.name }, {
      default: () => vnode
    })
  }
}
```

### 3. 多实例管理

```ts
// 提供全局管理器
class MountManager {
  private instances = new Map<string, VueMountResult>()

  mount(id: string, options: VueMountOptions) {
    this.unmount(id) // 先卸载同 ID 实例
    const result = vueMount(options)
    this.instances.set(id, result)
    return result
  }

  unmount(id: string) {
    const instance = this.instances.get(id)
    if (instance) {
      instance.unmount()
      this.instances.delete(id)
    }
  }

  unmountAll() {
    this.instances.forEach(instance => instance.unmount())
    this.instances.clear()
  }

  get(id: string) {
    return this.instances.get(id)
  }
}

export const mountManager = new MountManager()
```

### 4. Teleport 模式（Vue 3）

```ts
interface VueMountOptions {
  // ...其他选项
  teleport?: boolean | string  // 使用 Teleport 替代直接挂载
}
```

### 5. Slots 支持

```ts
interface VueMountOptions {
  // ...其他选项
  slots?: {
    default?: () => VNode
    [name: string]: (() => VNode) | undefined
  }
}

// 创建 VNode 时传入 children
const vnode = createVNode(component, props, slots)
```

### 6. 事件监听

```ts
interface VueMountOptions {
  // ...其他选项
  on?: Record<string, (...args: any[]) => void>
}

// 组件中自动绑定事件
const propsWithEvents = {
  ...props,
  onConfirm: on?.confirm,
  onCancel: on?.cancel,
}
```

### 7. KeepAlive 支持

```ts
interface VueMountOptions {
  // ...其他选项
  keepAlive?: boolean
}

// 包裹 KeepAlive 组件
```

---

## 使用示例

### 基础用法

```ts
import { vueMount } from 'vue-mount-plugin'
import MyModal from './MyModal.vue'

// 在组件内使用
const { unmount, instance } = vueMount({
  mountTarget: '#modal-container',
  component: MyModal,
  componentOptions: {
    title: 'Hello',
    visible: true
  },
  app: getCurrentInstance()?.appContext.app  // Vue 3
  // parent: this  // Vue 2
})

// 卸载
unmount()
```

### 在 setup 中使用（Vue 3）

```ts
import { getCurrentInstance, onUnmounted } from 'vue'
import { vueMount } from 'vue-mount-plugin'
import Message from './Message.vue'

export function useMessage() {
  const app = getCurrentInstance()?.appContext.app
  let current: VueMountResult | null = null

  const show = (text: string, type = 'info') => {
    current?.unmount()
    current = vueMount({
      component: Message,
      componentOptions: { text, type },
      app
    })
  }

  const hide = () => {
    current?.unmount()
    current = null
  }

  onUnmounted(hide)

  return { show, hide }
}
```

### 配合 Router 使用

```ts
// 自动关闭路由变化时的挂载组件
router.beforeEach(() => {
  mountManager.unmountAll()
})
```

---

## 完整类型定义

```ts
import type { Component, App, VNode } from 'vue'

export interface VueMountOptions {
  /** 挂载目标，CSS 选择器或 DOM 元素 */
  mountTarget?: string | Element

  /** Vue 组件 */
  component: Component

  /** 传递给组件的 props */
  componentOptions?: Record<string, any>

  /** Vue 3: 传入 app 实例以继承全局上下文 */
  app?: App

  /** Vue 2: 传入父组件实例以继承 $router, $store 等 */
  parent?: any

  /** 过渡动画配置 */
  transition?: {
    name: string
    appear?: boolean
  }

  /** 插槽 */
  slots?: Record<string, () => VNode>

  /** 事件监听 */
  on?: Record<string, (...args: any[]) => void>

  /** 生命周期钩子 */
  onMounted?: (instance: any) => void
  onBeforeUnmount?: (instance: any) => void
}

export interface VueMountResult {
  /** 卸载组件 */
  unmount: () => void

  /** 更新 props */
  update: (newProps: Record<string, any>) => void

  /** 组件实例 */
  instance: any

  /** 挂载容器 */
  container: Element
}

export function vueMount(options: VueMountOptions): VueMountResult
```

---

## 其他建议

### 1. SSR 兼容

检测 `document` 是否存在，避免 SSR 报错：

```ts
if (typeof document === 'undefined') {
  console.warn('vueMount can only be used in browser')
  return null
}
```

### 2. 错误处理

添加错误边界和异常捕获：

```ts
try {
  const vnode = createVNode(component, props)
  // ...
} catch (e) {
  console.error('[vueMount] Failed to mount component:', e)
  return null
}
```

### 3. TypeScript 增强

提供组件 props 类型推断：

```ts
export function vueMount<T extends Component>(
  options: VueMountOptions<T>
): VueMountResult<InstanceType<T>>
```

### 4. DevTools 支持

为挂载的组件添加 name 和 `__vue_devtools_uid__`：

```ts
container.setAttribute('data-vue-mount', component.name || 'Anonymous')
```

### 5. 内存泄漏防护

提供自动清理机制，避免忘记 unmount：

```ts
// 自动超时清理
interface VueMountOptions {
  autoUnmount?: number  // 毫秒数
}

if (autoUnmount) {
  setTimeout(() => unmount(), autoUnmount)
}
```

### 6. 指令穿透

确保自定义指令也能在挂载组件中正常工作。

### 7. Provide/Inject 增强

提供便捷的上下文注入 API：

```ts
vueMount({
  component: MyComponent,
  componentOptions: { ... },
  provide: {
    theme: 'dark',
    user: currentUser
  }
})
```

---

## 总结

| 方案 | Vue 版本 | 上下文继承 | 性能 | 复杂度 | 推荐场景 |
|------|---------|-----------|------|--------|---------|
| App Context | Vue 3 | 完整 | 高 | 低 | Vue 3 首选 |
| Parent (Vue.extend) | Vue 2 | 完整 | 高 | 低 | Vue 2 首选 |
| 独立 App 实例 | 通用 | 需手动 | 中 | 中 | 独立弹窗、无上下文需求 |
| Provide/Inject | 通用 | 部分 | 高 | 中 | 精细控制上下文 |

**最终推荐：** 采用统一 API + 多策略实现，根据 Vue 版本自动选择最佳策略。

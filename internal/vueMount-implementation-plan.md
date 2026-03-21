# vueMount 函数开发方案

> 基于用户需求：统一 API，内部根据 Vue 版本选择不同策略

## 一、需求回顾

```ts
vueMount({
  mountTarget: '',      // 挂载目标容器
  component: Component, // Vue 组件
  componentOptions: {   // 组件 props
    value: ''
  }
})
```

**核心要求：**
1. 被挂载组件能访问父组件上下文（`$router`、`$store`）
2. `componentOptions` 作为 props 传递
3. 可指定挂载目标，不指定时挂载到 body

---

## 二、开发方案

### 2.1 文件结构

```
src/
├── index.ts              # 更新导出
├── types.ts              # 扩展类型定义
├── vue2.ts               # 保留，小幅优化
├── vue3.ts               # 保留，小幅优化
├── vueMount.ts           # 🆕 统一挂载函数
├── mountManager.ts       # 🆕 实例管理器（可选）
└── utils/
    ├── vue.ts            # 保留
    └── context.ts        # 🆕 上下文自动获取
```

### 2.2 类型定义 (`types.ts` 扩展)

```ts
// ===== 新增类型 =====

/** vueMount 函数选项 */
export interface VueMountOptions {
  /** 挂载目标：CSS 选择器 | Element | null（默认挂载到 body） */
  mountTarget?: string | Element | null

  /** Vue 组件 */
  component: Component

  /** 传递给组件的 props */
  componentOptions?: Record<string, any>

  /** Vue 3: app 实例（不传自动获取） */
  app?: import('vue-demi').App

  /** Vue 2: 父组件实例（不传自动获取） */
  parent?: any

  /** 事件监听 */
  on?: Record<string, (...args: any[]) => void>

  /** 生命周期钩子 */
  onMounted?: (instance: any) => void
  onBeforeUnmount?: (instance: any) => void

  /** 自动卸载时间（毫秒），0 表示不自动卸载 */
  autoUnmount?: number
}

/** vueMount 返回值 */
export interface VueMountResult {
  /** 卸载组件 */
  unmount: () => void

  /** 更新组件 props */
  update: (newProps: Record<string, any>) => void

  /** 组件实例（Vue3: component proxy, Vue2: Vue 实例） */
  instance: any

  /** 挂载容器元素 */
  container: Element
}
```

### 2.3 上下文自动获取 (`utils/context.ts`)

```ts
import { isVue2, getCurrentInstance } from 'vue-demi'
import type { App } from 'vue-demi'

// 全局存储（插件安装时设置）
let globalApp: App | null = null
let globalParent: any = null

/** 设置全局上下文 */
export function setGlobalContext(app?: App, parent?: any) {
  if (app) globalApp = app
  if (parent) globalParent = parent
}

/** 获取全局 app */
export function getGlobalApp() {
  return globalApp
}

/** 获取全局 parent */
export function getGlobalParent() {
  return globalParent
}

/** 自动获取当前组件的上下文 */
export function getAutoContext() {
  if (isVue2) {
    // Vue 2: 尝试从当前实例获取 parent
    const instance = getCurrentInstance()
    return {
      parent: instance?.proxy || globalParent
    }
  } else {
    // Vue 3: 尝试获取 app
    const instance = getCurrentInstance()
    return {
      app: instance?.appContext?.app || globalApp
    }
  }
}
```

### 2.4 核心实现 (`vueMount.ts`)

```ts
import { isVue2, createVNode, render, nextTick, Vue2 } from 'vue-demi'
import type { Component, VueMountOptions, VueMountResult } from './types'
import { getAutoContext } from './utils/context'

/**
 * 统一挂载函数 - 支持 Vue 2 和 Vue 3
 */
export function vueMount(options: VueMountOptions): VueMountResult {
  const {
    mountTarget,
    component,
    componentOptions = {},
    app: inputApp,
    parent: inputParent,
    on: eventListeners,
    onMounted,
    onBeforeUnmount,
    autoUnmount = 0
  } = options

  // 1. SSR 检测
  if (typeof document === 'undefined') {
    console.warn('[vueMount] Can only be used in browser environment')
    return null as any
  }

  // 2. 自动获取上下文
  const autoContext = getAutoContext()
  const app = inputApp ?? autoContext.app
  const parent = inputParent ?? autoContext.parent

  // 3. 解析挂载容器
  const { container, shouldAppend } = resolveContainer(mountTarget)

  // 4. 根据版本选择挂载策略
  const result = isVue2
    ? mountVue2(component, componentOptions, container, shouldAppend, parent, eventListeners)
    : mountVue3(component, componentOptions, container, shouldAppend, app, eventListeners)

  // 5. 生命周期钩子
  if (onMounted) {
    nextTick(() => onMounted(result.instance))
  }

  // 6. 自动卸载定时器
  let autoUnmountTimer: ReturnType<typeof setTimeout> | null = null
  if (autoUnmount > 0) {
    autoUnmountTimer = setTimeout(() => result.unmount(), autoUnmount)
  }

  // 7. 包装 unmount
  const originalUnmount = result.unmount
  result.unmount = () => {
    if (autoUnmountTimer) clearTimeout(autoUnmountTimer)
    onBeforeUnmount?.(result.instance)
    originalUnmount()
  }

  return result
}

/** 解析挂载容器 */
function resolveContainer(mountTarget?: string | Element | null) {
  let container: Element
  let shouldAppend = false

  if (!mountTarget) {
    // 未指定，创建新容器
    container = document.createElement('div')
    shouldAppend = true
  } else if (typeof mountTarget === 'string') {
    // CSS 选择器
    const found = document.querySelector(mountTarget)
    if (found) {
      container = found
    } else {
      console.warn(`[vueMount] Target "${mountTarget}" not found, creating new container`)
      container = document.createElement('div')
      shouldAppend = true
    }
  } else {
    // Element
    container = mountTarget
  }

  return { container, shouldAppend }
}

/** Vue 3 挂载实现 */
function mountVue3(
  component: Component,
  props: Record<string, any>,
  container: Element,
  shouldAppend: boolean,
  app?: any,
  eventListeners?: Record<string, (...args: any[]) => void>
): VueMountResult {
  // 合并事件监听器到 props（Vue 3 使用 onXxx 命名）
  const propsWithEvents = { ...props }
  if (eventListeners) {
    Object.entries(eventListeners).forEach(([event, handler]) => {
      const eventName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
      propsWithEvents[eventName] = handler
    })
  }

  // 创建虚拟节点
  const vnode = createVNode(component, propsWithEvents)

  // 继承上下文
  if (app?._context) {
    vnode.appContext = app._context
  }

  // 挂载
  if (shouldAppend) {
    document.body.appendChild(container)
  }
  render(vnode, container)

  // 返回结果
  return {
    unmount: () => {
      render(null, container)
      if (shouldAppend && container.parentNode) {
        document.body.removeChild(container)
      }
    },
    update: (newProps) => {
      const merged = { ...propsWithEvents, ...newProps }
      const newVnode = createVNode(component, merged)
      if (app?._context) newVnode.appContext = app._context
      render(newVnode, container)
    },
    instance: vnode.component?.proxy,
    container
  }
}

/** Vue 2 挂载实现 */
function mountVue2(
  component: any,
  props: Record<string, any>,
  container: Element,
  shouldAppend: boolean,
  parent?: any,
  eventListeners?: Record<string, (...args: any[]) => void>
): VueMountResult {
  // 合并事件监听器
  const propsWithEvents = { ...props }
  if (eventListeners) {
    Object.entries(eventListeners).forEach(([event, handler]) => {
      propsWithEvents[event] = handler
    })
  }

  // 创建组件构造器
  const ComponentClass = Vue2.extend(component)

  // 创建实例选项
  const instanceOptions: any = {
    propsData: propsWithEvents
  }

  // 设置 parent 以继承上下文
  if (parent && parent._isVue) {
    instanceOptions.parent = parent
  }

  // 创建实例
  const instance = new ComponentClass(instanceOptions)

  // 挂载
  if (shouldAppend) {
    document.body.appendChild(container)
  }
  instance.$mount(container)

  // 返回结果
  return {
    unmount: () => {
      instance.$destroy()
      if (shouldAppend && instance.$el.parentNode) {
        document.body.removeChild(instance.$el)
      }
    },
    update: (newProps) => {
      Object.keys(newProps).forEach(key => {
        instance.$set(instance, key, newProps[key])
      })
    },
    instance,
    container: instance.$el
  }
}
```

### 2.5 入口更新 (`index.ts`)

```ts
import type { Component, Options, Vue2Options, Vue3Options, VueMountOptions, VueMountResult } from './types'
import { isVue2 } from 'vue-demi'
import { MountVue2 } from './vue2'
import { MountVue3 } from './vue3'
import { vueMount } from './vueMount'
import { setGlobalContext } from './utils/context'

export type {
  Component,
  CreateVNodeParameters,
  Data,
  Options,
  Vue2Options,
  Vue3Options,
  VueMountOptions,
  VueMountResult
} from './types'

// 兼容旧 API
const Mount = isVue2 ? MountVue2 : MountVue3
export default Mount as typeof MountVue2 | typeof MountVue3

// 直接导出类（兼容）
export { MountVue2, MountVue3 }

// 🆕 导出新的统一函数
export { vueMount }

// 🆕 工厂函数（类型安全）
export function createMount(component: Component, options?: Vue2Options): MountVue2
export function createMount(component: Component, options?: Vue3Options): MountVue3
export function createMount(component: Component, options?: Options): MountVue2 | MountVue3 {
  return new (isVue2 ? MountVue2 : MountVue3)(component, options as any) as MountVue2 | MountVue3
}

// 🆕 Vue 插件安装（支持全局上下文）
export const VueMountPlugin = {
  install(app: any) {
    if (isVue2) {
      // Vue 2: 挂载到原型
      app.prototype.$vueMount = vueMount
      setGlobalContext(undefined, app.prototype)
    } else {
      // Vue 3: 提供全局属性
      app.config.globalProperties.$vueMount = vueMount
      setGlobalContext(app)
    }
  }
}
```

---

## 三、使用示例

### 3.1 基础用法

```ts
import { vueMount } from 'vue-mount-plugin'
import MyModal from './MyModal.vue'

// 简单挂载
const { unmount, update, instance } = vueMount({
  component: MyModal,
  componentOptions: { title: 'Hello' }
})

// 更新 props
update({ title: 'Updated Title' })

// 卸载
unmount()
```

### 3.2 指定挂载目标

```ts
// 挂载到指定容器
vueMount({
  mountTarget: '#modal-container',
  component: MyModal,
  componentOptions: { title: 'Hello' }
})

// 挂载到 DOM 元素
vueMount({
  mountTarget: document.querySelector('.sidebar'),
  component: SidebarPanel
})
```

### 3.3 事件监听

```ts
const { unmount } = vueMount({
  component: ConfirmDialog,
  componentOptions: { message: '确认删除？' },
  on: {
    confirm: () => {
      console.log('用户确认')
      unmount()
    },
    cancel: () => {
      console.log('用户取消')
      unmount()
    }
  }
})
```

### 3.4 自动卸载

```ts
// 3 秒后自动卸载（适合 Toast）
vueMount({
  component: Toast,
  componentOptions: { message: '操作成功' },
  autoUnmount: 3000
})
```

### 3.5 Vue 3 组合式函数封装

```ts
// composables/useMount.ts
import { getCurrentInstance, onUnmounted } from 'vue'
import { vueMount, type VueMountOptions, type VueMountResult } from 'vue-mount-plugin'

export function useMount() {
  const instance = getCurrentInstance()
  const app = instance?.appContext.app
  const mountedInstances: VueMountResult[] = []

  const mount = (options: Omit<VueMountOptions, 'app'>): VueMountResult => {
    const result = vueMount({ ...options, app })
    mountedInstances.push(result)
    return result
  }

  const unmountAll = () => {
    mountedInstances.forEach(r => r.unmount())
    mountedInstances.length = 0
  }

  // 组件卸载时清理
  onUnmounted(unmountAll)

  return { mount, unmountAll }
}
```

### 3.6 Vue 2 中使用

```ts
// 组件内
export default {
  methods: {
    showModal() {
      const { unmount } = this.$vueMount({
        component: MyModal,
        componentOptions: { title: 'Hello' },
        parent: this  // 可选，不传会自动获取
      })

      this.modalUnmount = unmount
    },
    hideModal() {
      this.modalUnmount?.()
    }
  }
}
```

---

## 四、实施计划

### 阶段一：核心功能（预计 1-2 天）

| 任务 | 文件 | 状态 |
|------|------|------|
| 扩展类型定义 | `types.ts` | 待开发 |
| 新增上下文工具 | `utils/context.ts` | 待开发 |
| 实现 vueMount | `vueMount.ts` | 待开发 |
| 更新入口导出 | `index.ts` | 待开发 |
| 编写单元测试 | `tests/vueMount.test.ts` | 待开发 |

### 阶段二：增强功能（预计 1 天）

| 任务 | 说明 | 状态 |
|------|------|------|
| useMount composable | Vue 3 组合式函数 | 待开发 |
| MountManager | 实例管理器 | 待开发 |
| 更新示例 | examples/vue3 使用新 API | 待开发 |

### 阶段三：文档完善（预计 0.5 天）

| 任务 | 说明 |
|------|------|
| 更新 README | 新 API 文档 |
| 更新类型导出 | 类型推断优化 |

---

## 五、兼容性说明

| API | 状态 | 说明 |
|-----|------|------|
| `new MountVue2/MountVue3()` | 保留 | 现有代码无需修改 |
| `createMount()` | 保留 | 工厂函数 |
| `vueMount()` | 🆕 新增 | 推荐使用 |
| `useMount()` | 🆕 新增 | Vue 3 组合式函数 |

---

## 六、测试用例

```ts
import { describe, it, expect, vi } from 'vitest'
import { vueMount } from '../src/vueMount'

describe('vueMount', () => {
  it('should mount component to body by default', () => {
    const { container, unmount } = vueMount({
      component: { template: '<div id="test">Hello</div>' }
    })
    expect(document.body.contains(container)).toBe(true)
    unmount()
  })

  it('should mount to specified target', () => {
    const target = document.createElement('div')
    target.id = 'target'
    document.body.appendChild(target)

    const { container } = vueMount({
      mountTarget: '#target',
      component: { template: '<div>Test</div>' }
    })

    expect(container).toBe(target)
  })

  it('should pass componentOptions as props', () => {
    const { instance, unmount } = vueMount({
      component: {
        props: ['title'],
        template: '<div>{{ title }}</div>'
      },
      componentOptions: { title: 'Hello World' }
    })

    expect(instance.title).toBe('Hello World')
    unmount()
  })

  it('should support event listeners', () => {
    const handler = vi.fn()
    const { instance, unmount } = vueMount({
      component: {
        emits: ['click'],
        template: '<button @click="$emit(\'click\')">Click</button>'
      },
      on: { click: handler }
    })

    // 触发事件...
    unmount()
  })

  it('should auto unmount after timeout', async () => {
    vi.useFakeTimers()

    const { container } = vueMount({
      component: { template: '<div>Auto</div>' },
      autoUnmount: 1000
    })

    expect(document.body.contains(container)).toBe(true)

    vi.advanceTimersByTime(1000)

    expect(document.body.contains(container)).toBe(false)

    vi.useRealTimers()
  })
})
```

---

## 七、下一步行动

是否开始实施阶段一的开发？建议从以下顺序开始：

1. **扩展 `types.ts`** - 添加新类型定义
2. **创建 `utils/context.ts`** - 上下文自动获取
3. **创建 `vueMount.ts`** - 核心实现
4. **更新 `index.ts`** - 导出新 API
5. **编写测试** - 确保功能正确

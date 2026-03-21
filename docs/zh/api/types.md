# 类型

vue-mount-plugin 导出的 TypeScript 类型定义。

## 核心类型

### MountInstance

```typescript
interface MountInstance<T = ComponentPublicInstance> {
  // 属性
  vm: T | null
  el: HTMLElement | null
  mounted: boolean
  id: string
  options: MountOptions

  // 方法
  show: () => MountInstance<T>
  hide: () => MountInstance<T>
  unmount: () => void
  destroy: () => void  // unmount 的别名
  remove: () => void   // unmount 的别名
  setProps: (props: Partial<Data>) => MountInstance<T>
  setTarget: (target: string | Element | ShadowRoot) => MountInstance<T>
  setSlots: (slots: Slots) => MountInstance<T>
  setHooks: (hooks: LifecycleHooks) => MountInstance<T>
  on: (event: string, handler: Listener) => MountInstance<T>
  off: (event: string, handler?: Listener) => MountInstance<T>
  emit: (event: string, ...args: any[]) => MountInstance<T>
  then: <TResult = void>(resolve: (value: any) => TResult) => Promise<TResult>
  catch: <TResult = never>(reject: (error: any) => TResult) => Promise<any>
  finally: (onFinally: () => void) => Promise<any>
}
```

### MountOptions

```typescript
interface MountOptions extends LifecycleHooks {
  // 基础配置
  target?: string | Element | ShadowRoot | null
  tagName?: string
  replace?: boolean

  // 组件配置
  props?: Data | null
  children?: unknown
  slots?: Slots

  // 事件配置
  listeners?: Listeners
  on?: Listeners  // listeners 的别名

  // 上下文配置
  app?: App
  parent?: unknown
  context?: ContextOptions
  ref?: Ref<ComponentPublicInstance | null>

  // 高级配置
  zIndex?: number
  singleton?: boolean | string
  transition?: string | TransitionOptions
  delay?: number
  keepAlive?: KeepAliveOptions | boolean
}
```

## 生命周期类型

### LifecycleHooks

```typescript
interface LifecycleHooks {
  onBeforeMount?: (instance: MountInstance) => void
  onMounted?: (instance: MountInstance) => void
  onBeforeUnmount?: (instance: MountInstance) => void
  onUnmounted?: (instance: MountInstance) => void
}
```

## 事件类型

### Listener

```typescript
type Listener = (...args: any[]) => void
```

### Listeners

```typescript
type Listeners = Record<string, Listener | Listener[]>
```

## 插槽类型

### Slots

```typescript
interface Slots {
  default?: VNode | VNode[]
  [key: string]: VNode | VNode[] | undefined
}
```

## 配置类型

### GlobalConfig

```typescript
interface GlobalConfig extends Partial<MountOptions> {
  zIndex?: number
  container?: string | Element | null
  transition?: string | TransitionOptions
  context?: ContextOptions
  installed?: boolean
}
```

### MountPluginOptions

```typescript
interface MountPluginOptions extends GlobalConfig {
  name?: string  // 全局方法的自定义名称
}
```

## 上下文类型

### ContextOptions

```typescript
interface ContextOptions {
  router?: unknown
  store?: unknown
  i18n?: unknown
  [key: string]: unknown
}
```

## 过渡类型

### TransitionOptions

```typescript
interface TransitionOptions {
  name?: string
  appear?: boolean
  css?: boolean
  enterClass?: string
  leaveClass?: string
  enterActiveClass?: string
  leaveActiveClass?: string
  enterToClass?: string
  leaveToClass?: string
}
```

## KeepAlive 类型

### KeepAliveOptions

```typescript
interface KeepAliveOptions {
  enabled?: boolean
  include?: string | RegExp | string[]
  exclude?: string | RegExp | string[]
  max?: number
}
```

## 工具类型

### Data

```typescript
type Data = Record<string, unknown>
```

### Component

```typescript
type Component = any  // 同时适用于 Vue 2 和 Vue 3 组件
```

## 重新导出的 Vue 类型

```typescript
export type { App, AppContext, ComponentPublicInstance, Ref, VNode }
```

## 使用示例

### 类型化实例

```typescript
import { mount, type MountInstance } from 'vue-mount-plugin'
import type { MyComponentInstance } from './MyComponent.vue'

const instance: MountInstance<MyComponentInstance> = mount(MyComponent, {
  props: { title: 'Hello' }
})

// 访问类型化的组件实例
instance.vm?.myMethod()
```

### 自定义选项类型

```typescript
import { mount, type MountOptions } from 'vue-mount-plugin'

const options: MountOptions = {
  props: { title: 'Hello' },
  on: {
    close: () => console.log('已关闭')
  }
}

mount(Modal, options)
```

# Types

TypeScript type definitions exported by vue-mount-plugin.

## Core Types

### MountInstance

```typescript
interface MountInstance<T = ComponentPublicInstance> {
  // Properties
  vm: T | null
  el: HTMLElement | null
  mounted: boolean
  id: string
  options: MountOptions

  // Methods
  show: () => MountInstance<T>
  hide: () => MountInstance<T>
  unmount: () => void
  destroy: () => void  // Alias for unmount
  remove: () => void   // Alias for unmount
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
  // Basic Configuration
  target?: string | Element | ShadowRoot | null
  tagName?: string
  replace?: boolean

  // Component Configuration
  props?: Data | null
  children?: unknown
  slots?: Slots

  // Event Configuration
  listeners?: Listeners
  on?: Listeners  // Alias for listeners

  // Context Configuration
  app?: App
  parent?: unknown
  context?: ContextOptions
  ref?: Ref<ComponentPublicInstance | null>

  // Advanced Configuration
  zIndex?: number
  singleton?: boolean | string
  transition?: string | TransitionOptions
  delay?: number
  keepAlive?: KeepAliveOptions | boolean
}
```

## Lifecycle Types

### LifecycleHooks

```typescript
interface LifecycleHooks {
  onBeforeMount?: (instance: MountInstance) => void
  onMounted?: (instance: MountInstance) => void
  onBeforeUnmount?: (instance: MountInstance) => void
  onUnmounted?: (instance: MountInstance) => void
}
```

## Event Types

### Listener

```typescript
type Listener = (...args: any[]) => void
```

### Listeners

```typescript
type Listeners = Record<string, Listener | Listener[]>
```

## Slot Types

### Slots

```typescript
interface Slots {
  default?: VNode | VNode[]
  [key: string]: VNode | VNode[] | undefined
}
```

## Configuration Types

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
  name?: string  // Custom name for the global method
}
```

## Context Types

### ContextOptions

```typescript
interface ContextOptions {
  router?: unknown
  store?: unknown
  i18n?: unknown
  [key: string]: unknown
}
```

## Transition Types

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

## KeepAlive Types

### KeepAliveOptions

```typescript
interface KeepAliveOptions {
  enabled?: boolean
  include?: string | RegExp | string[]
  exclude?: string | RegExp | string[]
  max?: number
}
```

## Utility Types

### Data

```typescript
type Data = Record<string, unknown>
```

### Component

```typescript
type Component = any  // Works with both Vue 2 and Vue 3 components
```

## Re-exported Vue Types

```typescript
export type { App, AppContext, ComponentPublicInstance, Ref, VNode }
```

## Usage Examples

### Typed Instance

```typescript
import { mount, type MountInstance } from 'vue-mount-plugin'
import type { MyComponentInstance } from './MyComponent.vue'

const instance: MountInstance<MyComponentInstance> = mount(MyComponent, {
  props: { title: 'Hello' }
})

// Access typed component instance
instance.vm?.myMethod()
```

### Custom Options Type

```typescript
import { mount, type MountOptions } from 'vue-mount-plugin'

const options: MountOptions = {
  props: { title: 'Hello' },
  on: {
    close: () => console.log('Closed')
  }
}

mount(Modal, options)
```

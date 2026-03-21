# MountOptions

挂载组件的配置选项。

## 基础配置

### target

- **类型**：`string | Element | ShadowRoot | null`
- **默认**：`null`（document.body）

挂载目标元素或选择器。

```typescript
mount(Modal, { target: '#container' })
mount(Modal, { target: document.getElementById('app') })
```

### tagName

- **类型**：`string`
- **默认**：`'div'`

自动创建的容器元素的标签名。

```typescript
mount(Modal, { tagName: 'section' })
```

### zIndex

- **类型**：`number`
- **默认**：undefined

容器元素的 z-index。

```typescript
mount(Modal, { zIndex: 2000 })
```

## 组件配置

### props

- **类型**：`object | null`
- **默认**：undefined

传递给组件的 props。

```typescript
mount(UserProfile, {
  props: {
    userId: 123,
    editable: true
  }
})
```

### slots

- **类型**：`Slots`
- **默认**：undefined

传递给组件的插槽内容。

```typescript
import { h } from 'vue'

mount(Modal, {
  slots: {
    default: [h('p', '弹窗内容')],
    header: [h('h2', '标题')],
    footer: [h('button', '关闭')]
  }
})
```

## 事件配置

### listeners

- **类型**：`Listeners`
- **默认**：undefined

附加到组件的事件监听器。

```typescript
mount(Modal, {
  listeners: {
    close: () => console.log('已关闭'),
    submit: (data) => console.log('已提交:', data)
  }
})
```

### on

- **类型**：`Listeners`
- **默认**：undefined

`listeners` 的别名。

```typescript
mount(Modal, {
  on: {
    close: handleClose
  }
})
```

## 上下文配置

### app（Vue 3）

- **类型**：`App`
- **默认**：undefined

Vue 3 app 实例，用于上下文继承。

```typescript
import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()!

mount(Modal, {
  app: appContext.app
})
```

### parent（Vue 2）

- **类型**：`unknown`
- **默认**：undefined

Vue 2 父组件实例，用于上下文继承。

```typescript
mount(Modal, {
  parent: this
})
```

### context（Vue 2）

- **类型**：`ContextOptions`
- **默认**：undefined

Vue 2 的显式上下文。

```typescript
mount(Modal, {
  context: {
    router: this.$router,
    store: this.$store,
    i18n: this.$i18n
  }
})
```

## 生命周期钩子

### onBeforeMount

- **类型**：`(instance: MountInstance) => void`
- **默认**：undefined

组件挂载前调用。

```typescript
mount(Modal, {
  onBeforeMount: (instance) => {
    console.log('即将挂载')
  }
})
```

### onMounted

- **类型**：`(instance: MountInstance) => void`
- **默认**：undefined

组件挂载后调用。

```typescript
mount(Modal, {
  onMounted: (instance) => {
    console.log('已挂载', instance.el)
  }
})
```

### onBeforeUnmount

- **类型**：`(instance: MountInstance) => void`
- **默认**：undefined

组件卸载前调用。

```typescript
mount(Modal, {
  onBeforeUnmount: (instance) => {
    console.log('即将卸载')
  }
})
```

### onUnmounted

- **类型**：`(instance: MountInstance) => void`
- **默认**：undefined

组件卸载后调用。

```typescript
mount(Modal, {
  onUnmounted: (instance) => {
    console.log('已卸载')
  }
})
```

## 高级选项

### singleton

- **类型**：`boolean | string`
- **默认**：undefined

启用单例模式。

```typescript
// 布尔值 - 使用组件作为键
mount(Toast, { singleton: true })

// 字符串 - 自定义键
mount(Toast, { singleton: 'error-toast' })
```

### transition

- **类型**：`string | TransitionOptions`
- **默认**：undefined

过渡动画配置。

```typescript
mount(Modal, {
  transition: 'fade'
})

// 或带选项
mount(Modal, {
  transition: {
    name: 'fade',
    appear: true
  }
})
```

### delay

- **类型**：`number`
- **默认**：undefined

挂载前延迟（毫秒）。

```typescript
mount(Modal, { delay: 100 })
```

### keepAlive

- **类型**：`KeepAliveOptions | boolean`
- **默认**：undefined

KeepAlive 配置。

```typescript
mount(Modal, {
  keepAlive: true
})

// 或带选项
mount(Modal, {
  keepAlive: {
    include: ['ModalA', 'ModalB'],
    max: 5
  }
})
```

## 类型定义

```typescript
interface MountOptions extends LifecycleHooks {
  // 基础
  target?: string | Element | ShadowRoot | null
  tagName?: string
  zIndex?: number

  // 组件
  props?: Data | null
  slots?: Slots

  // 事件
  listeners?: Listeners
  on?: Listeners

  // 上下文
  app?: App
  parent?: unknown
  context?: ContextOptions
  ref?: Ref<ComponentPublicInstance | null>

  // 高级
  singleton?: boolean | string
  transition?: string | TransitionOptions
  delay?: number
  keepAlive?: KeepAliveOptions | boolean
}
```

# 进阶用法

## 使用 createMount 手动控制

精细控制组件生命周期：

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 创建实例但不显示
const instance = createMount(Modal, {
  props: { title: '延迟弹窗' }
})

console.log(instance.mounted) // false

// 需要时显示
instance.show()
console.log(instance.mounted) // true

// 隐藏但不销毁
instance.hide()
console.log(instance.mounted) // true（仍然追踪）

// 再次显示
instance.show()

// 完全销毁
instance.unmount()
console.log(instance.mounted) // false
```

## 上下文继承

### Vue 3

传递 `app` 实例以正确继承上下文：

```typescript
import { getCurrentInstance } from 'vue'
import { mount } from 'vue-mount-plugin'

const { appContext } = getCurrentInstance()!

const instance = mount(MyComponent, {
  app: appContext.app,
  props: { title: 'Hello' }
})

// 组件现在可以使用：
// - router（useRouter）
// - pinia stores（useStore）
// - i18n（useI18n）
// - 任何 provide 的值
```

### Vue 2

传递 `parent` 以继承上下文：

```typescript
import { mount } from 'vue-mount-plugin'

export default {
  methods: {
    showModal() {
      mount(MyComponent, {
        parent: this,
        props: { title: 'Hello' }
      })
    }
  }
}
```

### Vue 2 使用 context 选项

```typescript
mount(MyComponent, {
  parent: this,
  context: {
    router: this.$router,
    store: this.$store,
    i18n: this.$i18n
  }
})
```

## 插槽

向挂载的组件传递插槽内容：

```typescript
import { h } from 'vue'
import { mount } from 'vue-mount-plugin'

mount(Modal, {
  props: { title: 'Hello' },
  slots: {
    default: [h('p', '弹窗内容')],
    header: [h('h2', '自定义标题')],
    footer: [h('button', '关闭')]
  }
})
```

## Props 更新

挂载后动态更新 props：

```typescript
const instance = mount(Modal, {
  props: {
    title: '原标题',
    loading: false
  }
})

// 更新单个 prop
instance.setProps({ loading: true })

// 更新多个 props
instance.setProps({
  title: '更新后的标题',
  loading: false
})

// props 会合并
console.log(instance.options.props)
// { title: '更新后的标题', loading: false }
```

## 事件系统详解

### 多个监听器

```typescript
const instance = mount(Modal)

// 同一事件多个监听器
instance.on('update', handler1)
instance.on('update', handler2)

// emit 时两个处理器都会被调用
instance.emit('update', data)
```

### 移除监听器

```typescript
// 移除特定监听器
instance.off('update', handler)

// 移除该事件的所有监听器
instance.off('update')
```

### 发射事件

```typescript
instance.emit('custom-event', arg1, arg2, arg3)
```

### 链式调用

```typescript
instance
  .on('event1', handler1)
  .on('event2', handler2)
  .off('event1')
  .emit('event2', data)
```

## 全局配置

为所有实例设置默认值：

```typescript
import { setGlobalConfig, globalConfig } from 'vue-mount-plugin'

// 设置全局默认值
setGlobalConfig({
  zIndex: 2000,
  tagName: 'section'
})

// 所有实例继承这些默认值
mount(Modal) // zIndex: 2000, tagName: 'section'

// 实例选项覆盖全局配置
mount(Modal, { zIndex: 3000 }) // zIndex: 3000
```

## 实例管理

### 获取所有实例

```typescript
import { getInstances } from 'vue-mount-plugin'

const instances = getInstances()
console.log(`活动实例: ${instances.length}`)
```

### 通过 ID 获取实例

```typescript
import { getInstanceById } from 'vue-mount-plugin'

const instance = getInstanceById('mount-1-abc123')
if (instance) {
  instance.unmount()
}
```

### 卸载所有实例

```typescript
import { unmountAll } from 'vue-mount-plugin'

// 清理所有实例
unmountAll()
```

### 检查挂载状态

```typescript
import { isMounted } from 'vue-mount-plugin'

if (isMounted('mount-1-abc123')) {
  console.log('实例已挂载')
}
```

## 单例管理

```typescript
import {
  hasSingleton,
  getSingleton,
  clearSingletons
} from 'vue-mount-plugin'

// 检查单例是否存在
if (hasSingleton('my-toast')) {
  console.log('Toast 已存在')
}

// 获取单例实例
const existing = getSingleton('my-toast')

// 清除所有单例
clearSingletons()
```

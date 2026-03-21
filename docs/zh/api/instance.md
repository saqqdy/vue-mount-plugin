# MountInstance

MountInstance 接口表示已挂载的组件实例。

## 属性

### id

- **类型**：`string`（只读）
- **描述**：实例的唯一标识符

```typescript
console.log(instance.id) // 'mount-1-abc123'
```

### mounted

- **类型**：`boolean`（只读）
- **描述**：组件是否当前已挂载

```typescript
console.log(instance.mounted) // true 或 false
```

### el

- **类型**：`HTMLElement | null`（只读）
- **描述**：包含组件的 DOM 元素

```typescript
if (instance.el) {
  instance.el.style.opacity = '0.5'
}
```

### vm

- **类型**：`ComponentPublicInstance | null`（只读）
- **描述**：Vue 组件实例

```typescript
// 访问组件数据/方法
console.log(instance.vm?.someData)
instance.vm?.someMethod()
```

### options

- **类型**：`MountOptions`
- **描述**：合并后的选项（全局 + 实例）

```typescript
console.log(instance.options.props)
console.log(instance.options.zIndex)
```

## 方法

### show()

显示/挂载组件。返回 `this` 以支持链式调用。

```typescript
instance.show()
```

### hide()

隐藏组件但保留实例。返回 `this` 以支持链式调用。

```typescript
instance.hide()
```

### unmount()

卸载并完全销毁组件。

```typescript
instance.unmount()
```

### destroy()

`unmount()` 的别名。

```typescript
instance.destroy()
```

### remove()

`unmount()` 的别名。

```typescript
instance.remove()
```

### setProps()

更新组件 props。返回 `this` 以支持链式调用。

```typescript
instance.setProps({ title: '新标题' })
instance.setProps({ loading: true, data: newData })
```

### setTarget()

设置挂载目标。返回 `this` 以支持链式调用。

```typescript
instance.setTarget('#container')
instance.setTarget(document.body)
```

### setSlots()

设置插槽。返回 `this` 以支持链式调用。

```typescript
import { h } from 'vue'

instance.setSlots({
  default: [h('p', '内容')],
  header: [h('h2', '标题')]
})
```

### setHooks()

设置生命周期钩子。返回 `this` 以支持链式调用。

```typescript
instance.setHooks({
  onMounted: (inst) => console.log('已挂载'),
  onUnmounted: (inst) => console.log('已卸载')
})
```

### on()

添加事件监听器。返回 `this` 以支持链式调用。

```typescript
instance.on('close', () => {
  console.log('已关闭')
})
```

### off()

移除事件监听器。返回 `this` 以支持链式调用。

```typescript
const handler = () => console.log('事件')
instance.on('event', handler)
instance.off('event', handler) // 移除特定监听器
instance.off('event') // 移除该事件的所有监听器
```

### emit()

发射事件。返回 `this` 以支持链式调用。

```typescript
instance.emit('custom-event', data1, data2)
```

## Promise 方法

### then()

等待 close 事件。

```typescript
const result = await instance
```

### catch()

处理 Promise 拒绝。

```typescript
instance.catch(error => {
  console.error('错误:', error)
})
```

### finally()

Promise 完成后执行清理。

```typescript
instance.finally(() => {
  console.log('完成')
})
```

## 类型定义

```typescript
interface MountInstance<T = ComponentPublicInstance> {
  // 属性
  vm: T | null
  el: HTMLElement | null
  mounted: boolean
  id: string
  options: MountOptions

  // 方法
  setProps: (props: Partial<Data>) => MountInstance<T>
  show: () => MountInstance<T>
  hide: () => MountInstance<T>
  unmount: () => void
  on: (event: string, handler: Listener) => MountInstance<T>
  off: (event: string, handler?: Listener) => MountInstance<T>
  emit: (event: string, ...args: any[]) => MountInstance<T>
  then: <TResult = void>(resolve: (value: any) => TResult) => Promise<TResult>
  setTarget: (target: string | Element | ShadowRoot) => MountInstance<T>
  setHooks: (hooks: LifecycleHooks) => MountInstance<T>
  setSlots: (slots: Slots) => MountInstance<T>
}
```

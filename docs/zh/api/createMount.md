# createMount()

创建 Mount 实例但不显示。用于手动控制 show/hide/unmount 生命周期。

## 签名

```typescript
function createMount<T = any>(
  component: Component,
  options?: MountOptions
): MountInstance<T>
```

## 参数

### component

- **类型**：`Component`
- **必填**：是

要挂载的 Vue 组件。

### options

- **类型**：`MountOptions`
- **必填**：否
- **默认**：`{}`

挂载配置选项。

## 返回值

返回一个未显示的 `MountInstance`（`mounted: false`）。

## 示例

### 基础用法

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = createMount(Modal, {
  props: { title: 'Hello World' }
})

console.log(instance.mounted) // false

// 需要时显示
instance.show()

console.log(instance.mounted) // true
```

### 完整生命周期控制

```typescript
const instance = createMount(Modal, {
  props: { title: '手动控制' }
})

// 尚未显示
instance.show()  // 挂载并显示
instance.hide()  // 隐藏但保留实例
instance.show()  // 再次显示
instance.unmount() // 完全销毁
```

### 链式配置

```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .on('close', handleClose)
  .setTarget('#container')
  .setHooks({ onMounted: () => console.log('就绪') })

// 准备好后显示
instance.show()
```

## 使用场景

在以下情况使用 `createMount()` 而不是 `mount()`：

- 需要在显示前配置实例
- 想要多次显示/隐藏而不重新创建
- 需要在挂载前访问实例
- 实现持久化 UI 元素

## 另见

- [mount()](/zh/api/mount) - 创建并立即显示
- [MountInstance](/zh/api/instance) - 实例 API

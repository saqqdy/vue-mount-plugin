# mount()

创建 Mount 实例并立即显示。

## 签名

```typescript
function mount<T = any>(
  component: Component,
  options?: MountOptions
): MountInstance<T>
```

## 参数

### component

- **类型**：`Component`
- **必填**：是

要挂载的 Vue 组件。可以是：
- 组件对象
- `.vue` SFC 导入
- 异步组件

### options

- **类型**：`MountOptions`
- **必填**：否
- **默认**：`{}`

挂载配置选项。

## 返回值

返回一个已显示的 `MountInstance`（`mounted: true`）。

## 示例

### 基础用法

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: { title: 'Hello World' }
})

console.log(instance.mounted) // true
```

### 带选项

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' },
  zIndex: 2000,
  tagName: 'section',
  on: {
    close: () => console.log('已关闭')
  }
})
```

### Async/Await

```typescript
const result = await mount(ConfirmDialog, {
  props: { message: '确定吗？' }
})

if (result) {
  // 用户确认
}
```

### 单例

```typescript
// 同时只有一个 toast
mount(Toast, {
  singleton: true,
  props: { message: 'Hello' }
})
```

## 另见

- [createMount()](/zh/api/createMount) - 创建但不显示
- [MountInstance](/zh/api/instance) - 实例 API
- [MountOptions](/zh/api/options) - 所有选项

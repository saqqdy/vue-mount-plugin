# vue-mount-plugin 功能升级建议

## 1. 已定义但未实现的功能

### 1.1 Transition 支持

types.ts 已定义 `TransitionOptions`，但核心逻辑未实现。

**使用示例：**

```ts
mount(Modal, {
  transition: 'fade', // 简写
})

// 或完整配置
mount(Modal, {
  transition: {
    name: 'fade',
    appear: true,
    css: true,
    enterClass: 'fade-enter',
    leaveClass: 'fade-leave',
    enterActiveClass: 'fade-enter-active',
    leaveActiveClass: 'fade-leave-active',
    enterToClass: 'fade-enter-to',
    leaveToClass: 'fade-leave-to',
  },
})
```

**实现思路：**

- Vue 3: 使用 `<Transition>` 包裹组件
- Vue 2: 使用 `<transition>` 组件

### 1.2 KeepAlive 支持

types.ts 已定义 `KeepAliveOptions`，但核心逻辑未实现。

**使用示例：**

```ts
mount(Modal, {
  keepAlive: true, // 简写
})

// 或完整配置
mount(Modal, {
  keepAlive: {
    enabled: true,
    include: ['ModalA', 'ModalB'],
    exclude: ['ModalC'],
    max: 10,
  },
})
```

**实现思路：**

- Vue 3: 使用 `<KeepAlive>` 包裹组件
- Vue 2: 使用 `<keep-alive>` 组件

---

## 2. 实用性增强

### 2.1 z-index 自动管理

解决多个 modal 层叠时的 z-index 管理问题。

**使用示例：**

```ts
// 全局配置自动 z-index
Vue.use(MountPlugin, {
  zIndex: 'auto', // 或起始值 1000
})

// 单个实例禁用自动管理
mount(Modal, {
  zIndex: 'manual', // 手动控制
})
```

**功能特性：**

- 每次打开新实例自动递增 z-index
- 关闭实例后回收 z-index
- 支持设置最大值

### 2.2 Modal 队列

同时只显示一个 modal，其余排队等待。

**使用示例：**

```ts
mount(ModalA, { queue: 'modal' })
mount(ModalB, { queue: 'modal' }) // 等待 ModalA 关闭后显示
mount(ModalC, { queue: 'modal' }) // 等待 ModalB 关闭后显示
```

### 2.3 ESC 关闭

全局快捷键支持，按 ESC 关闭最上层实例。

**使用示例：**

```ts
// 全局启用
Vue.use(MountPlugin, {
  closeOnEsc: true,
})

// 单个实例控制
mount(Modal, {
  closeOnEsc: false, // 禁用 ESC 关闭
})
```

### 2.4 Focus Trap

无障碍支持，Tab 键锁定在 modal 内。

**使用示例：**

```ts
mount(Modal, {
  focusTrap: true, // 启用 focus trap
  autoFocus: true, // 自动聚焦到第一个可聚焦元素
})
```

### 2.5 Teleport 选项

Vue 3 支持 teleport 到指定位置。

**使用示例：**

```ts
mount(Modal, {
  teleport: 'body', // 或选择器 '#modal-container'
})
```

---

## 3. Composable 增强

### 3.1 useModalStack

管理多个 modal 栈。

```ts
const { open, close, closeAll, stack } = useModalStack()

open('confirm', ConfirmModal, { props: { title: '确认删除?' } })
open('detail', DetailModal, { props: { id: 1 } })

close('confirm') // 关闭指定
closeAll()       // 关闭全部

console.log(stack.value) // [{ id: 'confirm', instance }, ...]
```

### 3.2 useModalQueue

modal 队列管理。

```ts
const { enqueue, next, current, queue } = useModalQueue()

enqueue(ModalA, { props: { title: 'Step 1' } })
enqueue(ModalB, { props: { title: 'Step 2' } })

// ModalA 关闭后自动显示 ModalB
```

### 3.3 useModalConfirm

快速确认框。

```ts
const { confirm, alert, prompt } = useModalConfirm()

// 确认框
const result = await confirm({
  title: '确认删除?',
  message: '此操作不可撤销',
  confirmText: '删除',
  cancelText: '取消',
  type: 'danger', // info, warning, danger, success
})

// 提示框
await alert('操作成功')

// 输入框
const value = await prompt({
  title: '请输入名称',
  placeholder: '名称',
  defaultValue: '',
})
```

---

## 4. useMount 优化

### 4.1 Vue 2 自动清理

当前 `useMount` 在 Vue 2 下没有自动清理。

**当前代码：**

```ts
// Auto cleanup on component unmount
if (!isVue2) {
  onUnmounted(unmountAll)
}
```

**优化后：**

```ts
// vue-demi 会在 Vue 2 下使用 @vue/composition-api 的 onUnmounted
import { onUnmounted } from 'vue-demi'

// 直接使用，无需判断
onUnmounted(unmountAll)
```

### 4.2 TypeScript 类型增强

```ts
// 支持组件 props 类型推断
export function useMount(): UseMountReturn {
  const mount = <T extends Component, P = ComponentProps<T>>(
    component: T,
    options?: MountOptions & { props?: P }
  ): MountInstance<InstanceType<T>> => {
    // ...
  }

  return { mount, ... }
}
```

---

## 5. 其他优化

### 5.1 DevTools 集成

在 Vue DevTools 显示实例信息。

**实现思路：**

```ts
// 在 devtools 中显示
// - 实例 ID
// - 组件名称
// - mounted 状态
// - props 快照
```

### 5.2 SSR 兼容

检测 SSR 环境避免 DOM 操作。

```ts
// 添加 SSR 检测
const isSSR = typeof window === 'undefined'

export function mount(component, options) {
  if (isSSR) {
    console.warn('[vue-mount-plugin] SSR mode: mount() is a no-op')
    return createNoopInstance()
  }
  // ...
}
```

### 5.3 错误边界

组件错误时的优雅处理。

```ts
mount(Modal, {
  onError: (error, instance) => {
    console.error('Modal error:', error)
    instance.unmount()
  },
})
```

### 5.4 Vue 3 异步渲染问题

当前 `_mountVM` 是异步的，可能导致时序问题。

**当前代码：**

```ts
protected _mountVM(): void {
  getRender().then(render => {
    // 异步执行
    render(this._vNode, this.el)
    this.mounted = true
  })
}
```

**优化方案：**

```ts
// 方案 1: 同步导入 render
import { render } from 'vue'

// 方案 2: 提供 onReady 回调
instance.show().onReady(() => {
  console.log('mounted!')
})

// 方案 3: 返回 Promise
await instance.show()
```

---

## 6. 优先级建议

| 优先级 | 功能 | 原因 |
|--------|------|------|
| P0 | Transition 支持 | 用户最常用，提升体验 |
| P0 | z-index 自动管理 | 解决实际痛点 |
| P1 | ESC 关闭 | 提升用户体验 |
| P1 | Focus Trap | 无障碍支持 |
| P2 | KeepAlive 支持 | 优化性能 |
| P2 | useModalConfirm | 提高开发效率 |
| P3 | Modal 队列 | 特定场景需要 |
| P3 | DevTools 集成 | 调试体验 |

---

## 7. 文档完善建议

- [ ] API 文档补充所有选项说明
- [ ] 添加最佳实践指南
- [ ] 添加迁移指南 (v3 -> v4)
- [ ] 添加 TypeScript 类型说明
- [ ] 添加常见问题 FAQ

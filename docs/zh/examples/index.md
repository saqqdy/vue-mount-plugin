# 示例

本节提供常见用例的实际示例。

## 在线体验

在浏览器中直接体验 vue-mount-plugin：

<div class="playground-cards">

<a href="https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue3?file=src/App.vue" target="_blank" class="playground-card">
  <div class="playground-icon">⚡</div>
  <div class="playground-content">
    <div class="playground-title">Vue 3 在线演示</div>
    <div class="playground-desc">体验 Vue 3 + 组合式 API</div>
  </div>
</a>

<a href="https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue2?file=src/App.vue" target="_blank" class="playground-card">
  <div class="playground-icon">🔧</div>
  <div class="playground-content">
    <div class="playground-title">Vue 2 在线演示</div>
    <div class="playground-desc">体验 Vue 2 + 选项式 API</div>
  </div>
</a>

</div>

<style>
.playground-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0 24px;
}
.playground-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: all 0.25s;
  flex: 1;
  min-width: 240px;
}
.playground-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}
.playground-icon {
  font-size: 28px;
  line-height: 1;
}
.playground-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}
.playground-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>

## 可用示例

| 示例 | 描述 |
|------|------|
| [模态框](/zh/examples/modal) | 基础弹窗组件 |
| [确认对话框](/zh/examples/confirm-dialog) | 基于 Promise 的确认框 |
| [消息提示](/zh/examples/toast) | 单例消息通知 |
| [上下文继承](/zh/examples/context) | 正确传递上下文 |

## 快速示例

### 基础弹窗

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

mount(Modal, {
  props: { title: 'Hello World' }
})
```

### 确认对话框

```typescript
const confirmed = await mount(ConfirmDialog, {
  props: { message: '确定吗？' }
})

if (confirmed) {
  // 用户确认
}
```

### 消息提示

```typescript
mount(Toast, {
  singleton: true,
  props: { message: '成功!' }
})
```

### 带上下文

```typescript
// Vue 3
import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()!

mount(MyComponent, {
  app: appContext.app
})

// Vue 2
mount(MyComponent, {
  parent: this
})
```

## 本地运行示例

克隆仓库并运行示例应用：

```bash
git clone https://github.com/saqqdy/vue-mount-plugin.git
cd vue-mount-plugin

# 安装依赖
pnpm install

# 运行 Vue 3 示例
cd examples/vue3
pnpm dev

# 运行 Vue 2 示例
cd examples/vue2
pnpm dev
```

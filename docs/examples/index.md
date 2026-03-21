# Examples

This section provides practical examples for common use cases.

## Try Online

Experience vue-mount-plugin directly in your browser with our interactive playgrounds:

<div class="playground-cards">

<a href="https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue3?file=src/App.vue" target="_blank" class="playground-card">
  <div class="playground-icon">⚡</div>
  <div class="playground-content">
    <div class="playground-title">Vue 3 Playground</div>
    <div class="playground-desc">Try vue-mount-plugin with Vue 3 + Composition API</div>
  </div>
</a>

<a href="https://stackblitz.com/github/saqqdy/vue-mount-plugin/tree/master/examples/vue2?file=src/App.vue" target="_blank" class="playground-card">
  <div class="playground-icon">🔧</div>
  <div class="playground-content">
    <div class="playground-title">Vue 2 Playground</div>
    <div class="playground-desc">Try vue-mount-plugin with Vue 2 + Options API</div>
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

## Available Examples

| Example | Description |
|---------|-------------|
| [Modal](/examples/modal) | Basic modal component |
| [Confirm Dialog](/examples/confirm-dialog) | Promise-based confirmation |
| [Toast](/examples/toast) | Singleton toast notifications |
| [Context Inheritance](/examples/context) | Proper context passing |

## Quick Examples

### Basic Modal

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

mount(Modal, {
  props: { title: 'Hello World' }
})
```

### Confirm Dialog

```typescript
const confirmed = await mount(ConfirmDialog, {
  props: { message: 'Are you sure?' }
})

if (confirmed) {
  // User confirmed
}
```

### Toast Notification

```typescript
mount(Toast, {
  singleton: true,
  props: { message: 'Success!' }
})
```

### With Context

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

## Run Examples Locally

Clone the repository and run the example apps:

```bash
git clone https://github.com/saqqdy/vue-mount-plugin.git
cd vue-mount-plugin

# Install dependencies
pnpm install

# Run Vue 3 example
cd examples/vue3
pnpm dev

# Run Vue 2 example
cd examples/vue2
pnpm dev
```

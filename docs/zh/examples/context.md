# 上下文继承示例

本示例演示如何正确向动态挂载的组件传递上下文。

## 问题

动态挂载的组件无法自动访问：
- Vue Router
- Pinia/Vuex store
- Vue I18n
- Provided 值

## Vue 3 解决方案

传递 `app` 实例：

```vue
<template>
  <button @click="showModal">显示弹窗</button>
</template>

<script setup>
import { inject } from 'vue'
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// 从父组件获取 app
const app = inject('app')

function showModal() {
  mount(Modal, {
    app: app,
    props: { title: 'Hello' }
  })
}
</script>
```

### 在 main.ts 中配置

```typescript
// main.ts
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const router = createRouter({ ... })
const pinia = createPinia()
const i18n = createI18n({ ... })

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)

// Provide 用于上下文继承
app.provide('app', app)

app.mount('#app')
```

### 在挂载组件中使用上下文

```vue
<!-- Modal.vue -->
<template>
  <div class="modal">
    <h2>{{ t('modal.title') }}</h2>
    <p>路由: {{ route.path }}</p>
    <p>用户: {{ userStore.name }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()
</script>
```

## Vue 2 解决方案

传递 `parent` 以继承上下文：

```vue
<template>
  <button @click="showModal">显示弹窗</button>
</template>

<script>
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

export default {
  methods: {
    showModal() {
      mount(Modal, {
        parent: this,
        props: { title: 'Hello' }
      })
    }
  }
}
</script>
```

### 在挂载组件中使用上下文

```vue
<!-- Modal.vue -->
<template>
  <div class="modal">
    <h2>{{ $t('modal.title') }}</h2>
    <p>路由: {{ $route.path }}</p>
    <p>用户: {{ $store.state.user.name }}</p>
  </div>
</template>
```

## 显式上下文

更精确控制时，显式传递上下文：

```typescript
mount(Modal, {
  parent: this,
  context: {
    router: this.$router,
    store: this.$store,
    i18n: this.$i18n
  }
})
```

## 上下文组合式函数

创建可复用的组合式函数：

```typescript
// useMountWithContext.ts
import { inject } from 'vue'
import { mount } from 'vue-mount-plugin'

export function useMountWithContext() {
  const app = inject('app')

  return <T extends Component>(
    component: T,
    options?: MountOptions
  ) => {
    return mount(component, {
      ...options,
      app
    })
  }
}
```

### 使用

```typescript
import { useMountWithContext } from './useMountWithContext'
import Modal from './Modal.vue'

const mountWithContext = useMountWithContext()

function showModal() {
  mountWithContext(Modal, {
    props: { title: 'Hello' }
  })
}
```

## 上下文演示组件

```vue
<!-- ContextDemo.vue -->
<template>
  <div class="demo">
    <h2>{{ title }}</h2>
    <div class="status">
      <p>Router: {{ hasRouter ? '✅' : '❌' }}</p>
      <p>Store: {{ hasStore ? '✅' : '❌' }}</p>
      <p>I18n: {{ hasI18n ? '✅' : '❌' }}</p>
    </div>
    <button @click="emitResult">关闭</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String
})

const emit = defineEmits(['context-check', 'close'])

// 检查可用性
const hasRouter = computed(() => {
  try {
    const route = useRoute()
    emit('context-check', 'Router: OK')
    return true
  } catch {
    emit('context-check', 'Router: 缺失')
    return false
  }
})

const hasStore = computed(() => {
  try {
    const store = useStore()
    return !!store
  } catch {
    return false
  }
})

const hasI18n = computed(() => {
  try {
    const { t } = useI18n()
    return !!t
  } catch {
    return false
  }
})

function emitResult() {
  emit('close')
}
</script>
```

# Context Inheritance Example

This example shows how to properly pass context to dynamically mounted components.

## The Problem

Dynamically mounted components don't automatically have access to:
- Vue Router
- Pinia/Vuex store
- Vue I18n
- Provided values

## Vue 3 Solution

Pass the `app` instance:

```vue
<template>
  <button @click="showModal">Show Modal</button>
</template>

<script setup>
import { inject } from 'vue'
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

// Get app from parent
const app = inject('app')

function showModal() {
  mount(Modal, {
    app: app,
    props: { title: 'Hello' }
  })
}
</script>
```

### Setup in main.ts

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

// Provide for context inheritance
app.provide('app', app)

app.mount('#app')
```

### Using Context in Mounted Component

```vue
<!-- Modal.vue -->
<template>
  <div class="modal">
    <h2>{{ t('modal.title') }}</h2>
    <p>Route: {{ route.path }}</p>
    <p>User: {{ userStore.name }}</p>
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

## Vue 2 Solution

Pass `parent` for context inheritance:

```vue
<template>
  <button @click="showModal">Show Modal</button>
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

### Using Context in Mounted Component

```vue
<!-- Modal.vue -->
<template>
  <div class="modal">
    <h2>{{ $t('modal.title') }}</h2>
    <p>Route: {{ $route.path }}</p>
    <p>User: {{ $store.state.user.name }}</p>
  </div>
</template>
```

## Explicit Context

For more control, pass context explicitly:

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

## Composable for Context

Create a reusable composable:

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

### Usage

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

## Context Demo Component

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
    <button @click="emitResult">Close</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String
})

const emit = defineEmits(['context-check', 'close'])

// Check what's available
const hasRouter = computed(() => {
  try {
    const route = useRoute()
    emit('context-check', 'Router: OK')
    return true
  } catch {
    emit('context-check', 'Router: Missing')
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

# Vue 插件

## 安装

在你的 Vue 应用中注册插件：

### Vue 3

```typescript
import { createApp } from 'vue'
import { MountPlugin } from 'vue-mount-plugin'
import App from './App.vue'

const app = createApp(App)

// 使用默认名称安装（$show）
app.use(MountPlugin, { zIndex: 2000 })
```

### Vue 2

```typescript
import Vue from 'vue'
import { MountPlugin } from 'vue-mount-plugin'

Vue.use(MountPlugin, { zIndex: 2000 })
```

## 插件选项

```typescript
interface MountPluginOptions {
  // 全局方法的自定义名称（默认: '$show'）
  name?: string

  // 所有实例的默认 z-index
  zIndex?: number

  // 默认容器
  container?: string | Element

  // 默认过渡动画
  transition?: string | TransitionOptions
}
```

## 在组件中使用

### Vue 3 Options API

```typescript
export default {
  methods: {
    showModal() {
      this.$show(Modal, {
        props: { title: 'Hello' }
      })
    }
  }
}
```

### Vue 2

```typescript
export default {
  methods: {
    showModal() {
      this.$show(Modal, {
        props: { title: 'Hello' },
        parent: this
      })
    }
  }
}
```

## 自定义方法名

```typescript
// 使用自定义名称
app.use(MountPlugin, { name: '$mount' })

// 现在可以这样使用
this.$mount(Modal, options)
```

## 全局配置

插件选项会成为全局默认值：

```typescript
app.use(MountPlugin, {
  zIndex: 2000,
  transition: 'fade'
})

// 所有实例继承这些默认值
this.$show(Modal) // zIndex: 2000, transition: 'fade'

// 单个实例覆盖
this.$show(Modal, { zIndex: 3000 }) // zIndex: 3000
```

## TypeScript 支持

为全局方法添加类型声明：

```typescript
// env.d.ts
import { MountOptions, MountInstance } from 'vue-mount-plugin'

declare module 'vue' {
  interface ComponentCustomProperties {
    $show: (component: any, options?: MountOptions) => MountInstance
  }
}
```

## 对比：插件 vs 直接导入

| 特性 | 插件（`this.$show`） | 直接导入（`mount`） |
|------|---------------------|-------------------|
| 全局默认值 | ✅ | ✅（通过 setGlobalConfig） |
| 模板访问 | ✅ | ❌ |
| 组合式 API | ❌ | ✅ |
| Tree-shaking | ❌ | ✅ |
| TypeScript | 需要声明 | 内置支持 |

::: tip 建议
对于 Vue 3 组合式 API，推荐使用直接导入：

```typescript
import { mount } from 'vue-mount-plugin'
```

对于 Vue 2 或 Options API，插件方式更方便。
:::

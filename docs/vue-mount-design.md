# Vue Mount 功能设计文档

## 实现方式对比

### 方式一：Vue.extend + 手动挂载

```js
import Vue from 'vue'

function vueMount({ mountTarget, component, componentOptions = {} }) {
  // 创建容器
  const target = mountTarget
    ? document.querySelector(mountTarget)
    : document.createElement('div')

  if (!mountTarget) {
    document.body.appendChild(target)
  }

  // 继承父组件上下文
  const Constructor = Vue.extend({
    ...component,
    // 关键：继承调用者的父实例上下文
    parent: this?.$root ? this : undefined,
    router: this?.$router,
    store: this?.$store,
  })

  const instance = new Constructor({
    propsData: componentOptions,
  })

  instance.$mount(target)

  return instance
}
```

**优点**：简单直接，Vue 2 原生 API
**缺点**：上下文传递不够优雅，需要手动处理

---

### 方式二：动态组件 + 上下文注入（推荐）

```js
import Vue from 'vue'

function vueMount({ mountTarget, component, componentOptions = {}, parent = null }) {
  // 确定挂载目标
  let target = mountTarget
    ? document.querySelector(mountTarget)
    : null

  let shouldRemove = false
  if (!target) {
    target = document.createElement('div')
    document.body.appendChild(target)
    shouldRemove = true
  }

  // 获取父实例上下文
  const parentInstance = parent || vueMount._context?.parent

  // 创建包装组件，继承上下文
  const WrapperComponent = Vue.extend({
    parent: parentInstance,
    router: parentInstance?.$router,
    store: parentInstance?.$store,
    i18n: parentInstance?.$i18n,
    render(h) {
      return h(component, {
        props: componentOptions,
        on: componentOptions._listeners || {},
        scopedSlots: componentOptions._scopedSlots,
      })
    }
  })

  const instance = new WrapperComponent()
  instance.$mount(target)

  // 返回控制对象
  return {
    instance,
    target,
    unmount() {
      instance.$destroy()
      if (shouldRemove) {
        document.body.removeChild(target)
      }
    },
    update(newProps) {
      Object.assign(instance.$children[0]?.$options.propsData, newProps)
      instance.$forceUpdate()
    }
  }
}

// 存储全局上下文（可在 install 时设置）
vueMount._context = null
```

**优点**：上下文继承完整，返回可控制对象
**缺点**：稍复杂

---

### 方式三：provide/inject 模式

```js
import Vue from 'vue'

// 创建上下文提供者
function createMountProvider() {
  const Provider = Vue.extend({
    provide() {
      return {
        // 透传所有需要的服务
        $router: this.$router,
        $store: this.$store,
        $i18n: this.$i18n,
      }
    },
    render(h) {
      return h('div', { ref: 'container' })
    }
  })

  return Provider
}

function vueMount(options) {
  const { mountTarget, component, componentOptions } = options

  // ... 实现逻辑
}
```

---

## 功能设计与扩展建议

### 1. 核心功能扩展

```ts
interface MountOptions {
  // 挂载目标
  mountTarget?: string | Element

  // 组件
  component: Vue.Component

  // Props
  componentOptions?: Record<string, any>

  // 事件监听
  on?: Record<string, Function>

  // 插槽
  slots?: Record<string, any>

  // 父实例（用于继承上下文）
  parent?: Vue

  // 是否替换目标内容
  replace?: boolean

  // 层级
  zIndex?: number

  // 动画类名
  transitionClass?: string

  // 关闭回调
  onClose?: () => void
}
```

### 2. 返回值设计

```ts
interface MountInstance {
  // Vue 实例
  vm: Vue

  // DOM 元素
  el: HTMLElement

  // 更新 props
  setProps: (props: Record<string, any>) => void

  // 显示
  show: () => void

  // 隐藏
  hide: () => void

  // 销毁
  unmount: () => void

  // Promise 支持（等待关闭）
  then: (resolve: () => void) => Promise<void>
}
```

### 3. 高级特性建议

| 特性 | 说明 |
|------|------|
| **单例模式** | 同类型组件只允许一个实例 |
| **队列管理** | 多个实例排队显示 |
| **全局配置** | 默认 zIndex、动画、容器等 |
| **生命周期钩子** | beforeMount, mounted, beforeUnmount, unmounted |
| **Teleport** | 类似 Vue 3 的 Teleport 功能 |
| **响应式更新** | props 变化自动更新组件 |

### 4. 完整实现示例

```js
import Vue from 'vue'

class VueMount {
  static instances = new Set()
  static config = {
    defaultContainer: null,
    zIndex: 2000,
    transition: 'fade',
  }

  constructor(options) {
    this.options = { ...VueMount.config, ...options }
    this.init()
  }

  init() {
    const { mountTarget, component, componentOptions, parent, on } = this.options

    // 创建容器
    this.createContainer()

    // 创建实例
    this.createInstance()

    // 注册实例
    VueMount.instances.add(this)

    // 调用钩子
    this.options.onMounted?.(this)
  }

  createContainer() {
    const { mountTarget, zIndex } = this.options

    if (typeof mountTarget === 'string') {
      this.target = document.querySelector(mountTarget)
    } else if (mountTarget instanceof Element) {
      this.target = mountTarget
    } else {
      this.target = document.createElement('div')
      this.target.style.zIndex = zIndex
      document.body.appendChild(this.target)
      this.shouldRemove = true
    }
  }

  createInstance() {
    const { component, componentOptions, parent, on } = this.options

    // 获取父组件（支持链式调用）
    const parentInstance = parent || VueMount._caller || null

    const Constructor = Vue.extend({
      extends: component,
      parent: parentInstance,
    })

    this.vm = new Constructor({
      propsData: componentOptions,
    })

    // 绑定事件
    if (on) {
      Object.entries(on).forEach(([event, handler]) => {
        this.vm.$on(event, handler)
      })
    }

    this.vm.$mount(this.target)
  }

  setProps(props) {
    Object.assign(this.vm.$props, props)
    this.vm.$forceUpdate()
    return this
  }

  show() {
    this.target.style.display = ''
    return this
  }

  hide() {
    this.target.style.display = 'none'
    return this
  }

  unmount() {
    this.vm.$destroy()
    if (this.shouldRemove) {
      document.body.removeChild(this.target)
    }
    VueMount.instances.delete(this)
    this.options.onUnmounted?.()
  }

  // Promise 支持
  then(resolve) {
    return new Promise((res) => {
      this.vm.$once('close', () => {
        this.unmount()
        resolve?.()
        res()
      })
    })
  }
}

// 工厂函数
function vueMount(options) {
  // 保存调用者上下文
  VueMount._caller = this instanceof Vue ? this : null
  return new VueMount(options)
}

// 安装插件
vueMount.install = function(Vue, options = {}) {
  Object.assign(VueMount.config, options)
  Vue.prototype.$mount = vueMount
}

export { VueMount, vueMount }
```

---

## 其他建议

### 1. TypeScript 类型定义

```ts
declare module 'vue/types/vue' {
  interface Vue {
    $mount: typeof vueMount
  }
}
```

### 2. 单元测试建议

```js
describe('vueMount', () => {
  it('should inherit parent context', () => {
    const parent = new Vue({ router, store })
    const mount = parent.$mount({ component: MyComponent })
    expect(mount.vm.$router).toBe(router)
    expect(mount.vm.$store).toBe(store)
  })
})
```

### 3. 与现有方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **vueMount** | 轻量、可控 | 需自己维护 |
| **vue-mount-plugin** | 功能完整 | 依赖第三方 |
| **Element UI Dialog** | 开箱即用 | 仅限弹窗场景 |

### 4. 性能考虑

- 使用 `v-show` 代替 `v-if` 实现频繁显示/隐藏
- 添加 `keep-alive` 支持缓存组件状态
- 批量操作时使用 `requestAnimationFrame`

### 5. 使用示例

```js
// 基础用法
const modal = this.$show({
  component: Modal,
  componentOptions: { title: '标题' },
  on: {
    close: () => modal.unmount()
  }
})

// Promise 用法
await this.$show({
  component: Dialog,
  componentOptions: { message: '确认删除？' }
})

// 链式调用
this.$show({ component: Toast })
  .setProps({ message: '保存成功' })
  .hide()
```

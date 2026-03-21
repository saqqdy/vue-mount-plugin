# vue-mount-plugin 开发方案与改进计划

> 基于竞品分析和市场需求制定

## 一、产品定位

### 1.1 核心价值主张

```
┌─────────────────────────────────────────────────────────────┐
│                    vue-mount-plugin                         │
│                                                             │
│  "轻量、通用、强上下文继承的 Vue 组件动态挂载方案"            │
│                                                             │
│  • 通用性 - 任意 Vue 组件动态挂载（非模态框专用）             │
│  • 上下文 - 完整继承 router/store/i18n                       │
│  • 轻量 - 核心 < 5KB，零依赖                                 │
│  • 跨版本 - 同时支持 Vue 2 和 Vue 3                          │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 目标用户

| 用户类型 | 痛点 | 解决方案 |
|----------|------|----------|
| 企业应用开发者 | 上下文丢失 (router/store) | 强上下文继承 |
| 迁移期项目 | Vue 2 → 3 需换方案 | 跨版本支持 |
| 轻量项目 | 包体积敏感 | < 5KB |
| 非模态场景 | Toast/Tooltip 无方案 | 通用挂载 |

### 1.3 竞争差异化

| 维度 | vue-mount-plugin | vue-final-modal | vue-nice-modal |
|------|------------------|-----------------|----------------|
| 定位 | **通用挂载** | 模态框专用 | 模态框专用 |
| 上下文 | **强继承** | 弱 | 弱 |
| 体积 | **< 5KB** | ~20KB | ~3KB |
| 场景 | **Modal/Toast/Tooltip/...** | Modal | Modal |

---

## 二、API 设计方案

### 2.1 核心接口

```ts
interface MountOptions<T = any> {
  // ========== 基础配置 ==========
  /** 挂载目标容器，支持选择器或 Element */
  target?: string | Element | null

  /** 容器标签名，默认 'div' */
  tagName?: string

  /** 是否替换目标内容，默认 false */
  replace?: boolean

  // ========== 组件配置 ==========
  /** 传递给组件的 props */
  props?: Record<string, any>

  /** 事件监听器 */
  on?: Record<string, Function | Function[]>

  /** 插槽内容 */
  slots?: Record<string, any>

  // ========== 上下文配置 ==========
  /** 父组件实例（用于继承上下文） */
  parent?: any

  /** Vue 3 app 实例 */
  app?: App

  /** Vue 2 上下文 (router, store, i18n) */
  context?: {
    router?: any
    store?: any
    i18n?: any
    [key: string]: any
  }

  // ========== 高级配置 ==========
  /** z-index 层级 */
  zIndex?: number

  /** 是否单例模式 */
  singleton?: boolean | string

  /** 动画类名 */
  transition?: string | TransitionOptions

  /** 延迟挂载时间 (ms) */
  delay?: number
}

interface TransitionOptions {
  name?: string
  appear?: boolean
  css?: boolean
  enterClass?: string
  leaveClass?: string
}

interface MountInstance<T = any> {
  // ========== 属性 ==========
  /** Vue 实例 */
  vm: T

  /** DOM 元素 */
  el: HTMLElement

  /** 是否已挂载 */
  mounted: boolean

  /** 唯一 ID */
  id: string

  // ========== 方法 ==========
  /** 更新 props */
  setProps: (props: Partial<T>) => MountInstance<T>

  /** 显示/挂载 */
  show: () => MountInstance<T>

  /** 隐藏（保留实例） */
  hide: () => MountInstance<T>

  /** 销毁 */
  unmount: () => void

  /** 等待关闭事件 */
  then: <TResult = void>(resolve: (value: any) => TResult) => Promise<TResult>

  /** 事件监听 */
  on: (event: string, handler: Function) => MountInstance<T>

  /** 移除监听 */
  off: (event: string, handler?: Function) => MountInstance<T>
}
```

### 2.2 使用示例

#### 基础用法

```ts
import { mount } from 'vue-mount-plugin'
import MyComponent from './MyComponent.vue'

// 简单挂载
const instance = mount(MyComponent, {
  props: { title: 'Hello' },
  on: { close: () => instance.unmount() }
})

// 链式调用
mount(MyComponent)
  .setProps({ title: 'Hello' })
  .on('close', () => console.log('closed'))
  .show()

// Promise 支持
const result = await mount(MyComponent, { props: { title: 'Confirm?' } })
console.log('用户选择:', result)
```

#### 上下文继承

```ts
// Vue 2 - 自动继承调用者上下文
export default {
  methods: {
    showModal() {
      // 自动继承 this.$router, this.$store, this.$i18n
      const modal = this.$show(Modal, {
        props: { title: '标题' }
      })
    }
  }
}

// Vue 3 - 通过 app 继承
import { mount } from 'vue-mount-plugin'

const instance = mount(Modal, {
  app: app, // 传入 app 实例
  props: { title: '标题' }
})
```

#### 单例模式

```ts
// 同类型只允许一个实例
mount(Toast, {
  singleton: true,
  props: { message: '保存成功' }
})

// 带标识的单例
mount(Notification, {
  singleton: 'error-notifications',
  props: { type: 'error', message: '出错了' }
})
```

#### 挂载到指定容器

```ts
// 选择器
mount(Sidebar, {
  target: '#sidebar-container'
})

// Element
mount(Tooltip, {
  target: document.querySelector('.tooltip-area')
})

// 自动创建并追加到 body
mount(Modal, {
  target: null // 或不传
})
```

### 2.3 组合式 API

```ts
import { useMount } from 'vue-mount-plugin'

// 在 setup 中使用
const { mount, unmount, instances } = useMount()

const showModal = async () => {
  const instance = mount(Modal, { props: { title: 'Hello' } })
  const result = await instance
  console.log(result)
}

// 获取所有挂载实例
console.log(instances.value)
```

### 2.4 全局配置

```ts
// main.ts
import { createApp } from 'vue'
import MountPlugin from 'vue-mount-plugin'

const app = createApp(App)

app.use(MountPlugin, {
  // 默认 z-index
  zIndex: 2000,

  // 默认容器
  container: '#modals',

  // 默认动画
  transition: 'fade',

  // 全局上下文
  context: { router, store, i18n },

  // 生命周期钩子
  onBeforeMount: (instance) => console.log('mounting'),
  onMounted: (instance) => console.log('mounted'),
  onBeforeUnmount: (instance) => console.log('unmounting'),
  onUnmounted: (instance) => console.log('unmounted'),
})
```

---

## 三、架构设计

### 3.1 文件结构

```
src/
├── index.ts              # 入口文件，导出公共 API
├── types.ts              # 类型定义
├── core/
│   ├── base.ts           # 基础 Mount 类（公共逻辑）
│   ├── vue2.ts           # Vue 2 实现 (MountVue2)
│   └── vue3.ts           # Vue 3 实现 (MountVue3)
├── composables/
│   ├── useMount.ts       # 组合式 API
│   └── useSingleton.ts   # 单例管理
├── utils/
│   ├── context.ts        # 上下文继承工具
│   ├── dom.ts            # DOM 操作工具
│   └── events.ts         # 事件工具
├── plugins/
│   ├── singleton.ts      # 单例插件
│   └── transition.ts     # 动画插件
└── vue.ts                # 工具函数（现有）
```

### 3.2 类设计

```ts
// core/base.ts - 公共基类
abstract class MountBase implements MountInstance {
  // 公共属性
  abstract vm: any
  abstract el: HTMLElement
  id: string
  mounted: boolean = false
  options: MountOptions

  // 公共方法
  abstract show(): this
  abstract hide(): this
  abstract unmount(): void

  // 共享逻辑
  setProps(props: Record<string, any>): this { ... }
  on(event: string, handler: Function): this { ... }
  off(event: string, handler?: Function): this { ... }
  then(resolve: Function): Promise<any> { ... }
}

// core/vue2.ts
class MountVue2 extends MountBase {
  vm: Vue2Instance

  constructor(component: Component, options: MountOptions) {
    super()
    this.createVue2Instance()
  }

  private createVue2Instance() {
    // Vue.extend + 上下文继承
  }
}

// core/vue3.ts
class MountVue3 extends MountBase {
  vm: VNode

  constructor(component: Component, options: MountOptions) {
    super()
    this.createVue3VNode()
  }

  private createVue3VNode() {
    // createVNode + render
  }
}
```

### 3.3 上下文继承机制

```ts
// utils/context.ts

// Vue 2 上下文继承
export function inheritVue2Context(parent: any, options: MountOptions) {
  const context = options.context || {}

  // 自动从父组件获取
  if (parent && parent._isVue) {
    return {
      router: parent.$router || context.router,
      store: parent.$store || context.store,
      i18n: parent.$i18n || context.i18n,
      route: parent.$route,
    }
  }

  return context
}

// Vue 3 上下文继承
export function inheritVue3Context(app: App, options: MountOptions) {
  if (app?._context) {
    // 通过 appContext 继承
    return {
      appContext: app._context,
      provides: app._context.provides,
    }
  }
  return {}
}
```

---

## 四、开发计划

### Phase 1: 核心功能完善 (Week 1-2)

#### 优先级 P0

| 任务 | 描述 | 预估 |
|------|------|------|
| Promise 支持 | 支持 await 等待组件关闭 | 2h |
| 生命周期钩子 | beforeMount/mounted/unmounted | 2h |
| 事件系统 | on/off/emit 完整事件支持 | 3h |
| 类型完善 | 完整 TypeScript 泛型支持 | 2h |
| 单元测试 | 覆盖核心功能 | 4h |

#### 详细任务

```ts
// 1. Promise 支持
class MountBase {
  private _resolve: Function
  private _reject: Function
  private _promise: Promise<any>

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  then(resolve: Function) {
    return this._promise.then(resolve)
  }

  protected emitClose(value?: any) {
    this._resolve(value)
    this.unmount()
  }
}

// 2. 生命周期钩子
interface LifecycleHooks {
  beforeMount?: (instance: MountInstance) => void
  mounted?: (instance: MountInstance) => void
  beforeUnmount?: (instance: MountInstance) => void
  unmounted?: (instance: MountInstance) => void
}

// 3. 事件系统
class EventEmitter {
  private events = new Map<string, Set<Function>>()

  on(event: string, handler: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)
    return this
  }

  off(event: string, handler?: Function) {
    if (handler) {
      this.events.get(event)?.delete(handler)
    } else {
      this.events.delete(event)
    }
    return this
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach(h => h(...args))
  }
}
```

### Phase 2: 高级功能 (Week 3-4)

#### 优先级 P1

| 任务 | 描述 | 预估 |
|------|------|------|
| 全局配置 | install 时设置默认值 | 3h |
| 单例模式 | 同类型组件单例 | 3h |
| 插槽支持 | default/scoped slots | 4h |
| 组合式 API | useMount hook | 2h |
| 示例完善 | 多场景 Demo | 4h |

#### 详细任务

```ts
// 1. 全局配置
interface GlobalConfig extends Partial<MountOptions> {
  onBeforeMount?: LifecycleHooks['beforeMount']
  onMounted?: LifecycleHooks['mounted']
  onBeforeUnmount?: LifecycleHooks['beforeUnmount']
  onUnmounted?: LifecycleHooks['unmounted']
}

const globalConfig: GlobalConfig = {}

export function setGlobalConfig(config: GlobalConfig) {
  Object.assign(globalConfig, config)
}

// 2. 单例模式
const singletonInstances = new Map<string | symbol, MountInstance>()

export function getSingleton(key: string | symbol) {
  return singletonInstances.get(key)
}

export function setSingleton(key: string | symbol, instance: MountInstance) {
  const existing = singletonInstances.get(key)
  if (existing) {
    existing.unmount()
  }
  singletonInstances.set(key, instance)
}

// 3. useMount Hook
export function useMount() {
  const instances = ref<MountInstance[]>([])

  const mount = (component: Component, options?: MountOptions) => {
    const instance = createMount(component, options)
    instances.value.push(instance)
    return instance
  }

  const unmountAll = () => {
    instances.value.forEach(i => i.unmount())
    instances.value = []
  }

  onUnmounted(unmountAll)

  return { mount, unmountAll, instances }
}
```

### Phase 3: 生态建设 (Week 5-8)

#### 优先级 P2

| 任务 | 描述 | 预估 |
|------|------|------|
| 动画系统 | 可选过渡动画支持 | 4h |
| 队列管理 | 多实例排队显示 | 4h |
| UI 库适配器 | Element/Ant Design/Vant | 6h |
| 文档站点 | VitePress 文档 | 8h |
| Playground | 在线演示环境 | 4h |

#### 详细任务

```ts
// 1. 动画系统
interface TransitionPlugin {
  name: string
  beforeEnter?: (el: Element) => void
  enter?: (el: Element, done: () => void) => void
  afterEnter?: (el: Element) => void
  beforeLeave?: (el: Element) => void
  leave?: (el: Element, done: () => void) => void
  afterLeave?: (el: Element) => void
}

// 内置动画
export const transitions = {
  fade: {
    name: 'fade',
    enter: (el) => { el.style.opacity = '0' },
    // ...
  },
  slide: { ... },
  zoom: { ... },
}

// 2. 队列管理
class MountQueue {
  private queue: Array<() => void> = []
  private current: MountInstance | null = null

  add(instance: MountInstance) {
    if (this.current) {
      this.queue.push(() => this.show(instance))
    } else {
      this.show(instance)
    }
  }

  private show(instance: MountInstance) {
    this.current = instance
    instance.on('close', () => {
      this.current = null
      this.next()
    })
    instance.show()
  }

  private next() {
    const next = this.queue.shift()
    if (next) next()
  }
}
```

---

## 五、测试计划

### 5.1 单元测试

```ts
describe('vue-mount-plugin', () => {
  describe('基础功能', () => {
    it('should mount component to body')
    it('should mount to custom target')
    it('should pass props correctly')
    it('should handle events')
    it('should support slots')
  })

  describe('上下文继承', () => {
    it('should inherit router in Vue 2')
    it('should inherit store in Vue 2')
    it('should inherit i18n in Vue 2')
    it('should inherit appContext in Vue 3')
  })

  describe('生命周期', () => {
    it('should call beforeMount hook')
    it('should call mounted hook')
    it('should call beforeUnmount hook')
    it('should call unmounted hook')
  })

  describe('Promise 支持', () => {
    it('should resolve on close')
    it('should reject on cancel')
    it('should support async/await')
  })

  describe('单例模式', () => {
    it('should allow only one instance')
    it('should replace existing instance')
  })
})
```

### 5.2 E2E 测试

```ts
describe('vue-mount-plugin E2E', () => {
  it('should show and hide modal')
  it('should handle toast queue')
  it('should inherit context correctly')
})
```

---

## 六、发布计划

### 6.1 版本规划

| 版本 | 功能 | 时间 |
|------|------|------|
| 3.3.0 | Promise + 生命周期 + 事件系统 | Week 2 |
| 3.4.0 | 全局配置 + 单例 + useMount | Week 4 |
| 4.0.0 | 动画系统 + 队列 + UI 适配器 | Week 8 |

### 6.2 Breaking Changes (v4.0.0)

```ts
// 旧 API (v3.x)
const instance = new Mount(Component, options)

// 新 API (v4.x)
const instance = mount(Component, options)
// 或
const instance = createMount(Component, options)()
```

---

## 七、推广策略

### 7.1 技术内容

| 类型 | 标题 | 平台 |
|------|------|------|
| 文章 | Vue 组件动态挂载最佳实践 | 掘金、知乎 |
| 文章 | vue-mount-plugin vs vue-final-modal 对比 | 掘金 |
| 文章 | Vue 2/3 跨版本组件挂载方案 | 公众号 |
| 视频 | 10分钟掌握 vue-mount-plugin | B站 |

### 7.2 社区建设

- GitHub Discussions 开启
- Issues 模板完善
- 贡献指南
- 更新日志 (CHANGELOG)

### 7.3 示例仓库

```
examples/
├── vue2-basic/          # Vue 2 基础用法
├── vue2-element/        # Vue 2 + Element UI
├── vue3-basic/          # Vue 3 基础用法
├── vue3-antd/           # Vue 3 + Ant Design Vue
├── toast-demo/          # Toast 组件示例
├── modal-demo/          # Modal 组件示例
└── context-menu-demo/   # 右键菜单示例
```

---

## 八、风险评估

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| Vue 3 API 变化 | 低 | 高 | 关注 Vue RFC |
| 竞品功能对标 | 中 | 中 | 保持差异化 |
| 社区接受度低 | 中 | 高 | 加强推广 |
| TypeScript 兼容性 | 低 | 中 | 完善类型定义 |

---

## 九、成功指标

### 短期目标 (1月)

- [ ] 完成核心功能 (Promise, 生命周期, 事件)
- [ ] 单元测试覆盖率 > 90%
- [ ] 周下载量 > 100

### 中期目标 (3月)

- [ ] 完成 UI 库适配器
- [ ] 文档站点上线
- [ ] 周下载量 > 500
- [ ] GitHub Stars > 100

### 长期目标 (6月)

- [ ] 生态完善 (配套组件)
- [ ] 周下载量 > 2000
- [ ] GitHub Stars > 300
- [ ] 被知名项目引用

# Vue 动态挂载插件竞品分析

> 数据更新时间：2026-03-19

## 一、竞品概览

| 项目 | Vue 版本 | 周下载量 | GitHub Stars | 定位 |
|------|----------|----------|--------------|------|
| **vue-mount-plugin** | Vue 2/3 | 2 | - | 通用组件动态挂载 |
| **vue-final-modal** | Vue 2/3 | 51,591 | 1,009 | 全功能模态框解决方案 |
| **vue-js-modal** | Vue 2 | 58,592 | 4,331 | 经典模态框组件 |
| **@vueuse/core** | Vue 2/3 | 4,934,213 | 22,147 | Vue 组合式工具库 |
| **vue-nice-modal** | Vue 2/3 | 45 | 57 | 命令式模态框 |
| **vue-simple-modal** | Vue 2 | 3 | - | 简单模态框 |

---

## 二、竞品详细分析

### 1. vue-final-modal

**仓库**: https://github.com/vue-final/vue-final-modal

**数据概览**:
- 最新版本: 4.5.5
- 周下载量: 51,591
- GitHub Stars: 1,009
- 最后更新: 2024-09-10
- License: MIT

**核心特性**:
- 支持 Vue 2 和 Vue 3
- 提供命令式 API：`$vfm.show()`, `$vfm.hide()`
- 支持嵌套模态框
- 支持 Transition 动画
- 支持 Teleport
- TypeScript 支持
- 移动端友好
- 无渲染组件 (Renderless)

**API 设计**:
```js
// 命令式调用
this.$vfm.show({
  component: MyModal,
  bind: { title: 'Hello' },
  on: {
    confirm: () => console.log('confirmed')
  }
})

// 组合式 API
import { useModal } from 'vue-final-modal'
const { show, hide } = useModal({ component: MyModal })
```

**优点**:
- ✅ 功能完整，社区活跃
- ✅ 双版本支持 (Vue 2/3)
- ✅ TypeScript 原生支持
- ✅ 文档完善 (https://vue-final-modal.org)
- ✅ 无渲染组件设计，样式可定制

**缺点**:
- ❌ 主要面向模态框场景
- ❌ 包体积较大 (~20KB)
- ❌ API 相对复杂
- ❌ 上下文继承需要额外配置

---

### 2. vue-js-modal

**仓库**: https://github.com/euvl/vue-js-modal

**数据概览**:
- 最新版本: 2.0.1
- 周下载量: 58,592
- GitHub Stars: 4,331
- 最后更新: 2023-03-20 (已停止维护)
- License: MIT

**核心特性**:
- Vue 2 专用
- 多种内置动画效果
- 支持拖拽、缩放
- 动态尺寸自适应
- 可定制样式

**API 设计**:
```js
// 基础用法
this.$modal.show(MyComponent, { title: 'Hello' })

// 动态调用
this.$modal.show({
  template: '<div>Dynamic</div>'
})

// 关闭
this.$modal.hide('modal-name')
```

**优点**:
- ✅ 简单易用
- ✅ 动画效果丰富
- ✅ 历史悠久，稳定
- ✅ 文档齐全

**缺点**:
- ❌ 仅支持 Vue 2
- ❌ 不再积极维护
- ❌ 缺少 TypeScript 支持
- ❌ 无上下文继承机制

---

### 3. @vueuse/core

**仓库**: https://github.com/vueuse/vueuse

**数据概览**:
- 最新版本: 14.2.1
- 周下载量: 4,934,213
- GitHub Stars: 22,147
- 最后更新: 2026-03-16 (活跃维护)
- License: MIT

**相关功能**:

| 函数 | 用途 |
|------|------|
| `createApp` | 创建独立 Vue 应用实例 |
| `createGlobalState` | 全局状态管理 |
| `createInjectionState` | 依赖注入状态 |
| `useMounted` | 组件挂载状态 |
| `tryUseContext` | 获取组件上下文 |

**API 设计**:
```js
import { createApp, createGlobalState } from '@vueuse/core'

// 创建独立应用
const app = createApp(MyComponent)
app.mount('#container')

// 全局状态
const useGlobalState = createGlobalState(() => ref(0))
```

**优点**:
- ✅ 功能全面，生态丰富
- ✅ TypeScript 完善
- ✅ 持续维护更新
- ✅ 社区庞大 (22K+ Stars)
- ✅ Tree-shakable

**缺点**:
- ❌ 非专门的挂载方案
- ❌ 需要自行组合实现
- ❌ 学习成本较高
- ❌ 上下文继承需手动处理

---

### 4. vue-nice-modal

**仓库**: https://github.com/worldzhao/vue-nice-modal

**数据概览**:
- 最新版本: 2.1.1
- 周下载量: 45
- GitHub Stars: 57
- 最后更新: 2025-03-30
- License: MIT
- 描述: Vue version of @ebay/nice-modal-react

**核心特性**:
- 支持 Vue 2 和 Vue 3 (通过 vue-demi)
- 命令式调用
- Promise 支持
- 轻量级设计
- 可与任何 UI 库配合使用
- 完整 TypeScript 支持

**API 设计**:
```js
import NiceModal from 'vue-nice-modal'

// 创建模态框
const MyModal = NiceModal.create(MyComponent)

// 调用并等待结果
const result = await NiceModal.show(MyModal, { title: 'Hello' })

// 使用 useModal Hook
const modal = NiceModal.useModal(MyModal)
await modal.show({ title: 'Hello' })
```

**完整用法示例**:
```vue
<!-- App.vue -->
<template>
  <NiceModalProvider>
    <router-view />
  </NiceModalProvider>
</template>

<!-- my-modal.vue -->
<template>
  <el-dialog :visible="modal.visible.value" @closed="modal.remove">
    <!-- content -->
  </el-dialog>
</template>

<script setup>
import { useModal } from 'vue-nice-modal'
const modal = useModal()

const handleConfirm = () => {
  modal.resolve('confirmed')
  modal.hide()
}
</script>
```

**优点**:
- ✅ API 简洁优雅
- ✅ Promise 支持
- ✅ 轻量级 (~3KB)
- ✅ 跨版本支持 (vue-demi)
- ✅ 可配合任意 UI 库

**缺点**:
- ❌ 社区较小 (57 Stars)
- ❌ 需要 Provider 包裹
- ❌ 功能相对简单
- ❌ 无内置动画

---

### 5. vue-simple-modal

**仓库**: https://github.com/cyio/vue-simple-modal

**数据概览**:
- 最新版本: 1.1.0
- 周下载量: 3
- 最后更新: 2017-09-04 (已停止维护)
- License: MIT

**核心特性**:
- 轻量级设计
- 无外部依赖
- 可定制样式
- 简单易用

**API 设计**:
```js
// 组件方式
<vue-modal :show="showModal" @close="toggleModal"></vue-modal>

// 安装
Vue.use(VueModal)
```

**优点**:
- ✅ 极其轻量 (~2KB)
- ✅ 简单直接
- ✅ 无依赖

**缺点**:
- ❌ 功能有限
- ❌ 已停止维护
- ❌ 仅支持 Vue 2
- ❌ 文档简单

---

### 6. Element Plus / Element UI Dialog

**官方组件库的对话框方案**

**API 设计**:
```js
// Vue 2 (Element UI)
this.$msgbox({
  title: '提示',
  message: '内容',
  confirmButtonText: '确定'
})

// Vue 3 (Element Plus)
import { ElMessageBox } from 'element-plus'
ElMessageBox.confirm('确认删除？')
```

**优点**:
- ✅ 开箱即用
- ✅ 与组件库风格统一
- ✅ 功能完善

**缺点**:
- ❌ 绑定特定 UI 框架
- ❌ 样式定制受限
- ❌ 包体积大
- ❌ 上下文继承不完整

---

## 三、功能对比矩阵

| 功能 | vue-mount-plugin | vue-final-modal | vue-js-modal | vueuse | vue-nice-modal |
|------|------------------|-----------------|--------------|--------|----------------|
| Vue 2 支持 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vue 3 支持 | ✅ | ✅ | ❌ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ❌ | ✅ | ✅ |
| 周下载量 | 2 | 51,591 | 58,592 | 4.9M | 45 |
| GitHub Stars | - | 1,009 | 4,331 | 22,147 | 57 |
| 命令式调用 | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Props 传递 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 事件监听 | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| 上下文继承 | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ |
| 自定义容器 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Promise 支持 | ❌ | ✅ | ❌ | ❌ | ✅ |
| 插槽支持 | ⚠️ | ✅ | ✅ | ❌ | ⚠️ |
| 动画支持 | ❌ | ✅ | ✅ | ❌ | ❌ |
| 单例模式 | ❌ | ✅ | ✅ | ❌ | ❌ |
| 包体积 | ~3KB | ~20KB | ~15KB | 按需 | ~3KB |
| 维护状态 | 活跃 | 活跃 | 停止 | 活跃 | 活跃 |
| 通用挂载 | ✅ | ❌ | ❌ | ⚠️ | ❌ |
| (非模态框) | | | | | |

> ✅ 完整支持 | ⚠️ 部分支持/需额外配置 | ❌ 不支持

---

## 四、市场格局分析

### 下载量分布

```
@vueuse/core     ████████████████████████████████████████  4,934,213
vue-js-modal     █████                                    58,592
vue-final-modal  █████                                    51,591
vue-nice-modal   (45)
vue-mount-plugin (2)
vue-simple-modal (3)
```

### 定位分析

```
                    通用性
                      ↑
                      │
    vue-mount-plugin ●│
                      │
    @vueuse/core ●────┼────● vue-final-modal
                      │
                      │         ● vue-js-modal
                      │         ● vue-nice-modal
                      │         ● vue-simple-modal
                      │
                      └──────────────────→ 模态框专用
```

---

## 五、优劣势分析

### 竞品优势

| 方面 | 具体表现 |
|------|----------|
| **功能丰富** | 内置动画、拖拽、嵌套等高级功能 |
| **生态完善** | 文档、示例、社区支持齐全 |
| **UI 集成** | 与主流 UI 库无缝配合 |
| **Promise 支持** | 现代异步编程体验 |
| **类型定义** | TypeScript 开发体验好 |
| **市场认可** | 下载量和 Stars 数据高 |

### 竞品劣势

| 方面 | 具体表现 |
|------|----------|
| **场景受限** | 多数只支持模态框/弹窗场景 |
| **包体积大** | 功能多导致体积较大 |
| **上下文问题** | router/store/i18n 继承不完善 |
| **版本绑定** | vue-js-modal 只支持 Vue 2 |
| **定制困难** | 深度定制需要 Fork |
| **维护状态** | 部分项目已停止维护 |

---

## 六、差异化竞争策略

### 1. 定位差异化

| 维度 | 竞品 | vue-mount-plugin |
|------|------|------------------|
| **场景** | 模态框专用 | **通用组件挂载** |
| **上下文** | 弱继承 | **强继承** (router/store/i18n) |
| **体积** | 10-20KB | **< 5KB** |
| **API** | 面向模态框 | **面向任意组件** |
| **灵活性** | 受限 | **高度灵活** |

### 2. 核心竞争力

```
┌─────────────────────────────────────────────────────────┐
│                  vue-mount-plugin                       │
├─────────────────────────────────────────────────────────┤
│  ✅ 通用性：任意 Vue 组件动态挂载（非模态框专用）          │
│  ✅ 上下文：完整继承父组件 router/store/i18n             │
│  ✅ 轻量：核心 < 5KB，零依赖                             │
│  ✅ 跨版本：同时支持 Vue 2 和 Vue 3                      │
│  ✅ 类型安全：完整 TypeScript 支持                        │
│  ✅ 简单：API 简洁直观，无学习成本                        │
└─────────────────────────────────────────────────────────┘
```

### 3. 功能增强建议

| 优先级 | 功能 | 说明 | 竞品对比 |
|--------|------|------|----------|
| **P0** | Promise 支持 | 提升异步编程体验 | 对齐 vue-nice-modal |
| **P0** | 生命周期钩子 | beforeMount/mounted/unmounted | 增强 |
| **P1** | 全局配置 | 默认容器、zIndex 等 | 对齐 vue-final-modal |
| **P1** | 事件透传 | 自动透传组件事件 | 增强 |
| **P2** | 插槽支持 | 支持 default/scoped slots | 对齐竞品 |
| **P2** | 动画集成 | 可选动画支持 | 对齐 vue-final-modal |
| **P3** | 单例模式 | 同类型组件单例 | 对齐竞品 |
| **P3** | 队列管理 | 多实例排队显示 | 增强 |

---

## 七、市场机会

### 1. 痛点分析

| 用户痛点 | 现有方案问题 | vue-mount-plugin 机会 |
|----------|--------------|----------------------|
| 上下文丢失 | router/store 不可用 | ✅ 强上下文继承 |
| 包体积大 | 功能冗余，体积大 | ✅ 轻量级设计 |
| 场景受限 | 只能做模态框 | ✅ 通用挂载 |
| 版本迁移 | 需要更换方案 | ✅ 跨版本支持 |
| 学习成本 | API 复杂 | ✅ 简洁 API |

### 2. 目标用户

- 需要轻量级方案的开发者
- 有上下文继承需求的场景（企业应用）
- Vue 2 到 Vue 3 迁移期的项目
- 非模态框场景的动态挂载需求（Toast、Tooltip、Popover 等）
- 对包体积敏感的项目

### 3. 使用场景对比

| 场景 | vue-mount-plugin | vue-final-modal | vue-nice-modal |
|------|------------------|-----------------|----------------|
| Modal/Dialog | ✅ | ✅ | ✅ |
| Toast/Message | ✅ | ❌ | ❌ |
| Tooltip/Popover | ✅ | ❌ | ❌ |
| Context Menu | ✅ | ❌ | ❌ |
| Drawer/Sidebar | ✅ | ⚠️ | ❌ |
| 浮动面板 | ✅ | ❌ | ❌ |

---

## 八、总结

### SWOT 分析

| | **S (优势)** | **W (劣势)** |
|---|--------------|--------------|
| **内部** | 轻量、通用、上下文完整、跨版本 | 功能较少、社区小、文档待完善、下载量低 |
| **外部** | **O (机会)** | **T (威胁)** |
| | 上下文痛点、版本迁移、轻量需求、非模态框场景 | 竞品成熟、用户习惯、生态差距、品牌认知度低 |

### 建议优先级

1. **短期** (1-2周)
   - [x] 完成 Vue 2/3 拆分
   - [ ] 补充 Promise 支持
   - [ ] 完善生命周期钩子
   - [ ] 丰富使用示例

2. **中期** (1-2月)
   - [ ] 完善文档站点
   - [ ] 添加更多实用工具函数
   - [ ] 社区推广（技术文章）
   - [ ] CI/CD 优化

3. **长期** (3-6月)
   - [ ] 生态建设（配套组件）
   - [ ] UI 库适配器
   - [ ] 性能优化
   - [ ] 提升下载量和 Stars

---

## 九、参考链接

| 项目 | 链接 |
|------|------|
| vue-final-modal | https://github.com/vue-final/vue-final-modal |
| vue-js-modal | https://github.com/euvl/vue-js-modal |
| VueUse | https://github.com/vueuse/vueuse |
| vue-nice-modal | https://github.com/worldzhao/vue-nice-modal |
| Element Plus Dialog | https://element-plus.org/zh-CN/component/dialog.html |
| Vuetify Dialogs | https://vuetifyjs.com/en/components/dialogs/ |

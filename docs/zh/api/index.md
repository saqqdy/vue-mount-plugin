# API 参考

欢迎使用 vue-mount-plugin API 参考。本节提供所有导出函数、类型和接口的详细文档。

## 概览

vue-mount-plugin 导出以下内容：

### 核心函数

| 函数 | 描述 |
|------|------|
| [`mount()`](/zh/api/mount) | 创建并立即显示组件 |
| [`createMount()`](/zh/api/createMount) | 创建实例但不显示 |

### 实例管理

| 函数 | 描述 |
|------|------|
| `getInstances()` | 获取所有活动实例 |
| `getInstanceById()` | 通过 ID 获取实例 |
| `unmountAll()` | 卸载所有实例 |
| `isMounted()` | 检查实例是否已挂载 |
| `getActiveInstanceIds()` | 获取所有活动实例 ID |

### 单例管理

| 函数 | 描述 |
|------|------|
| `getSingleton()` | 通过键获取单例实例 |
| `setSingleton()` | 设置单例实例 |
| `hasSingleton()` | 检查单例是否存在 |
| `removeSingleton()` | 通过键移除单例 |
| `clearSingletons()` | 清除所有单例 |

### 配置

| 函数 | 描述 |
|------|------|
| `setGlobalConfig()` | 设置全局配置 |
| `globalConfig` | 全局配置对象 |

### 组合式函数

| 函数 | 描述 |
|------|------|
| `useMount()` | Vue 3 实例管理组合式函数 |
| `useSingleton()` | Vue 3 单例管理组合式函数 |

### 插件

| 导出 | 描述 |
|------|------|
| `MountPlugin` | Vue 插件，提供 `$show` 方法 |

## 快速参考

```typescript
import {
  // 核心
  mount,
  createMount,

  // 实例管理
  getInstances,
  getInstanceById,
  unmountAll,
  isMounted,
  getActiveInstanceIds,

  // 单例
  getSingleton,
  setSingleton,
  hasSingleton,
  removeSingleton,
  clearSingletons,

  // 配置
  setGlobalConfig,
  globalConfig,

  // 组合式函数
  useMount,
  useSingleton,

  // 插件
  MountPlugin,

  // 类型
  type MountInstance,
  type MountOptions,
  type LifecycleHooks,
  type GlobalConfig,
} from 'vue-mount-plugin'
```

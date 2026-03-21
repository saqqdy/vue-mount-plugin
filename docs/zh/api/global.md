# 全局函数

用于管理实例和全局配置的函数。

## 实例管理

### getInstances()

获取所有活动的挂载实例。

```typescript
function getInstances(): MountInstance[]
```

```typescript
import { getInstances } from 'vue-mount-plugin'

const instances = getInstances()
console.log(`活动实例: ${instances.length}`)

// 访问每个实例
instances.forEach(instance => {
  console.log(instance.id, instance.mounted)
})
```

### getInstanceById()

通过 ID 获取特定实例。

```typescript
function getInstanceById(id: string): MountInstance | undefined
```

```typescript
import { getInstanceById } from 'vue-mount-plugin'

const instance = getInstanceById('mount-1-abc123')
if (instance) {
  instance.unmount()
}
```

### unmountAll()

卸载所有活动实例。

```typescript
function unmountAll(): void
```

```typescript
import { unmountAll } from 'vue-mount-plugin'

// 清理所有实例
unmountAll()
```

### isMounted()

检查实例是否已挂载。

```typescript
function isMounted(id: string): boolean
```

```typescript
import { isMounted } from 'vue-mount-plugin'

if (isMounted('mount-1-abc123')) {
  console.log('实例已挂载')
}
```

### getActiveInstanceIds()

获取所有活动实例 ID。

```typescript
function getActiveInstanceIds(): string[]
```

```typescript
import { getActiveInstanceIds } from 'vue-mount-plugin'

const ids = getActiveInstanceIds()
console.log('活动实例 ID:', ids)
```

## 单例管理

### getSingleton()

通过键获取单例实例。

```typescript
function getSingleton(key: string | symbol): MountInstance | undefined
```

```typescript
import { getSingleton } from 'vue-mount-plugin'

const toast = getSingleton('my-toast')
if (toast) {
  toast.setProps({ message: '已更新!' })
}
```

### setSingleton()

设置单例实例。

```typescript
function setSingleton(key: string | symbol, instance: MountInstance): void
```

```typescript
import { setSingleton } from 'vue-mount-plugin'

setSingleton('my-toast', instance)
```

### hasSingleton()

检查单例是否存在。

```typescript
function hasSingleton(key: string | symbol): boolean
```

```typescript
import { hasSingleton } from 'vue-mount-plugin'

if (hasSingleton('my-toast')) {
  console.log('Toast 已存在')
}
```

### removeSingleton()

通过键移除单例。

```typescript
function removeSingleton(key: string | symbol): void
```

```typescript
import { removeSingleton } from 'vue-mount-plugin'

removeSingleton('my-toast')
```

### clearSingletons()

清除所有单例实例。

```typescript
function clearSingletons(): void
```

```typescript
import { clearSingletons } from 'vue-mount-plugin'

clearSingletons()
```

## 配置

### setGlobalConfig()

设置全局配置默认值。

```typescript
function setGlobalConfig(config: Partial<GlobalConfig>): void
```

```typescript
import { setGlobalConfig } from 'vue-mount-plugin'

setGlobalConfig({
  zIndex: 2000,
  tagName: 'section',
  transition: 'fade'
})

// 所有实例继承这些默认值
mount(Modal) // 使用全局配置
```

### globalConfig

全局配置对象。

```typescript
const globalConfig: GlobalConfig
```

```typescript
import { globalConfig } from 'vue-mount-plugin'

console.log(globalConfig.zIndex)
console.log(globalConfig.installed)
```

## 类型定义

```typescript
interface GlobalConfig extends Partial<MountOptions> {
  zIndex?: number
  container?: string | Element | null
  transition?: string | TransitionOptions
  context?: ContextOptions
  installed?: boolean
}
```

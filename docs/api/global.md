# Global Functions

Functions for managing instances and global configuration.

## Instance Management

### getInstances()

Get all active mount instances.

```typescript
function getInstances(): MountInstance[]
```

```typescript
import { getInstances } from 'vue-mount-plugin'

const instances = getInstances()
console.log(`Active instances: ${instances.length}`)

// Access each instance
instances.forEach(instance => {
  console.log(instance.id, instance.mounted)
})
```

### getInstanceById()

Get a specific instance by its ID.

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

Unmount all active instances.

```typescript
function unmountAll(): void
```

```typescript
import { unmountAll } from 'vue-mount-plugin'

// Cleanup all instances
unmountAll()
```

### isMounted()

Check if an instance is currently mounted.

```typescript
function isMounted(id: string): boolean
```

```typescript
import { isMounted } from 'vue-mount-plugin'

if (isMounted('mount-1-abc123')) {
  console.log('Instance is mounted')
}
```

### getActiveInstanceIds()

Get all active instance IDs.

```typescript
function getActiveInstanceIds(): string[]
```

```typescript
import { getActiveInstanceIds } from 'vue-mount-plugin'

const ids = getActiveInstanceIds()
console.log('Active instance IDs:', ids)
```

## Singleton Management

### getSingleton()

Get a singleton instance by key.

```typescript
function getSingleton(key: string | symbol): MountInstance | undefined
```

```typescript
import { getSingleton } from 'vue-mount-plugin'

const toast = getSingleton('my-toast')
if (toast) {
  toast.setProps({ message: 'Updated!' })
}
```

### setSingleton()

Set a singleton instance.

```typescript
function setSingleton(key: string | symbol, instance: MountInstance): void
```

```typescript
import { setSingleton } from 'vue-mount-plugin'

setSingleton('my-toast', instance)
```

### hasSingleton()

Check if a singleton exists.

```typescript
function hasSingleton(key: string | symbol): boolean
```

```typescript
import { hasSingleton } from 'vue-mount-plugin'

if (hasSingleton('my-toast')) {
  console.log('Toast already exists')
}
```

### removeSingleton()

Remove a singleton by key.

```typescript
function removeSingleton(key: string | symbol): void
```

```typescript
import { removeSingleton } from 'vue-mount-plugin'

removeSingleton('my-toast')
```

### clearSingletons()

Clear all singleton instances.

```typescript
function clearSingletons(): void
```

```typescript
import { clearSingletons } from 'vue-mount-plugin'

clearSingletons()
```

## Configuration

### setGlobalConfig()

Set global configuration defaults.

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

// All instances inherit these defaults
mount(Modal) // Uses global config
```

### globalConfig

The global configuration object.

```typescript
const globalConfig: GlobalConfig
```

```typescript
import { globalConfig } from 'vue-mount-plugin'

console.log(globalConfig.zIndex)
console.log(globalConfig.installed)
```

## Type Definitions

```typescript
interface GlobalConfig extends Partial<MountOptions> {
  zIndex?: number
  container?: string | Element | null
  transition?: string | TransitionOptions
  context?: ContextOptions
  installed?: boolean
}
```

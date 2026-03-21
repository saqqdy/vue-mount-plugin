# API Reference

Welcome to the vue-mount-plugin API reference. This section provides detailed documentation for all exported functions, types, and interfaces.

## Overview

vue-mount-plugin exports the following:

### Core Functions

| Function | Description |
|----------|-------------|
| [`mount()`](/api/mount) | Create and immediately show a component |
| [`createMount()`](/api/createMount) | Create an instance without showing |

### Instance Management

| Function | Description |
|----------|-------------|
| `getInstances()` | Get all active instances |
| `getInstanceById()` | Get instance by ID |
| `unmountAll()` | Unmount all instances |
| `isMounted()` | Check if instance is mounted |
| `getActiveInstanceIds()` | Get all active instance IDs |

### Singleton Management

| Function | Description |
|----------|-------------|
| `getSingleton()` | Get singleton instance by key |
| `setSingleton()` | Set singleton instance |
| `hasSingleton()` | Check if singleton exists |
| `removeSingleton()` | Remove singleton by key |
| `clearSingletons()` | Clear all singletons |

### Configuration

| Function | Description |
|----------|-------------|
| `setGlobalConfig()` | Set global configuration |
| `globalConfig` | Global configuration object |

### Composables

| Function | Description |
|----------|-------------|
| `useMount()` | Vue 3 composable for instance management |
| `useSingleton()` | Vue 3 composable for singleton management |

### Plugin

| Export | Description |
|--------|-------------|
| `MountPlugin` | Vue plugin for `$show` method |

## Quick Reference

```typescript
import {
  // Core
  mount,
  createMount,

  // Instance management
  getInstances,
  getInstanceById,
  unmountAll,
  isMounted,
  getActiveInstanceIds,

  // Singleton
  getSingleton,
  setSingleton,
  hasSingleton,
  removeSingleton,
  clearSingletons,

  // Configuration
  setGlobalConfig,
  globalConfig,

  // Composables
  useMount,
  useSingleton,

  // Plugin
  MountPlugin,

  // Types
  type MountInstance,
  type MountOptions,
  type LifecycleHooks,
  type GlobalConfig,
} from 'vue-mount-plugin'
```

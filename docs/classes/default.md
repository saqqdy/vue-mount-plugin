[index.md - v2.0.0](../README.md) / [Exports](../modules.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [options](default.md#options)
- [seed](default.md#seed)
- [target](default.md#target)
- [vNode](default.md#vnode)

### Methods

- [createVM](default.md#createvm)
- [mount](default.md#mount)
- [unmount](default.md#unmount)

## Constructors

### constructor

• **new default**(`component`, `options?`)

#### Parameters

| Name        | Type                                                                |
| :---------- | :------------------------------------------------------------------ |
| `component` | `VNodeTypes` \| `ClassComponent` \| typeof `NULL_DYNAMIC_COMPONENT` |
| `options`   | [`Options`](../interfaces/Options.md)                               |

#### Defined in

[index.ts:50](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L50)

## Properties

### options

• **options**: [`Options`](../interfaces/Options.md) = `{}`

#### Defined in

[index.ts:48](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L48)

---

### seed

• **seed**: `number` = `1`

#### Defined in

[index.ts:49](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L49)

---

### target

• **target**: `Element` \| `ShadowRoot`

#### Defined in

[index.ts:47](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L47)

---

### vNode

• **vNode**: `any` = `null`

#### Defined in

[index.ts:46](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L46)

## Methods

### createVM

▸ **createVM**(`component`, `«destructured»?`): `any`

#### Parameters

| Name             | Type                                                                |
| :--------------- | :------------------------------------------------------------------ |
| `component`      | `VNodeTypes` \| `ClassComponent` \| typeof `NULL_DYNAMIC_COMPONENT` |
| `«destructured»` | [`Options`](../interfaces/Options.md)                               |

#### Returns

`any`

#### Defined in

[index.ts:60](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L60)

---

### mount

▸ **mount**(): `void`

#### Returns

`void`

#### Defined in

[index.ts:91](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L91)

---

### unmount

▸ **unmount**(): `void`

#### Returns

`void`

#### Defined in

[index.ts:102](https://github.com/saqqdy/vue-mount-plugin/blob/d21b85b/src/index.ts#L102)

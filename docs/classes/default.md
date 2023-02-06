[index.md - v1.0.0](../README.md) / [Exports](../modules.md) / default

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
- [destroy](default.md#destroy)
- [mount](default.md#mount)

## Constructors

### constructor

• **new default**(`component`, `options?`)

#### Parameters

| Name        | Type                                                                |
| :---------- | :------------------------------------------------------------------ |
| `component` | `VNodeTypes` \| `ClassComponent` \| typeof `NULL_DYNAMIC_COMPONENT` |
| `options`   | [`Options`](../interfaces/Options.md)                               |

#### Defined in

[index.ts:40](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L40)

## Properties

### options

• **options**: [`Options`](../interfaces/Options.md) = `{}`

#### Defined in

[index.ts:38](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L38)

---

### seed

• **seed**: `number` = `1`

#### Defined in

[index.ts:39](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L39)

---

### target

• **target**: `Element` \| `ShadowRoot`

#### Defined in

[index.ts:37](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L37)

---

### vNode

• **vNode**: `any` = `null`

#### Defined in

[index.ts:36](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L36)

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

[index.ts:47](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L47)

---

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Defined in

[index.ts:89](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L89)

---

### mount

▸ **mount**(): `void`

#### Returns

`void`

#### Defined in

[index.ts:78](https://github.com/saqqdy/vue-mount-plugin/blob/86c8f88/src/index.ts#L78)

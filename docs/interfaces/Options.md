[index.md - v2.1.1](../README.md) / [Exports](../modules.md) / Options

# Interface: Options

## Table of contents

### Properties

- [app](Options.md#app)
- [children](Options.md#children)
- [context](Options.md#context)
- [dynamicProps](Options.md#dynamicprops)
- [isBlockNode](Options.md#isblocknode)
- [parent](Options.md#parent)
- [patchFlag](Options.md#patchflag)
- [props](Options.md#props)
- [tagName](Options.md#tagname)
- [target](Options.md#target)

## Properties

### app

• `Optional` **app**: `App`<`any`\>

vue3.0 app

#### Defined in

[index.ts:30](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L30)

---

### children

• `Optional` **children**: `unknown`

children

#### Defined in

[index.ts:15](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L15)

---

### context

• `Optional` **context**: [`Data`](../modules.md#data) & { `i18n`: `unknown` ; `router`: `unknown` ; `store`: `unknown` }

vue2.0 context

#### Defined in

[index.ts:34](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L34)

---

### dynamicProps

• `Optional` **dynamicProps**: `null` \| `string`[]

#### Defined in

[index.ts:17](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L17)

---

### isBlockNode

• `Optional` **isBlockNode**: `boolean`

#### Defined in

[index.ts:18](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L18)

---

### parent

• `Optional` **parent**: `unknown`

parent context

#### Defined in

[index.ts:42](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L42)

---

### patchFlag

• `Optional` **patchFlag**: `number`

#### Defined in

[index.ts:16](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L16)

---

### props

• `Optional` **props**: `null` \| [`Data`](../modules.md#data) & `VNodeProps`

propsData

#### Defined in

[index.ts:11](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L11)

---

### tagName

• `Optional` **tagName**: keyof `HTMLElementTagNameMap`

tagName of mount target, default: div

#### Defined in

[index.ts:26](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L26)

---

### target

• `Optional` **target**: `Element` \| `ShadowRoot`

mount target

#### Defined in

[index.ts:22](https://github.com/saqqdy/vue-mount-plugin/blob/301dc36/src/index.ts#L22)

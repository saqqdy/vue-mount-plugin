<template>
  <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
    <div style="background: white; border-radius: 12px; padding: 24px; min-width: 300px; max-width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: #42b883;">{{ title || 'Modal' }}</h3>
        <button @click="handleClose" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0 5px;">&times;</button>
      </div>
      <p style="margin: 0 0 20px 0; color: #666;">
        This is a modal component mounted via vue-mount-plugin.
        It can be closed by clicking the X button or clicking outside.
      </p>
      <div style="text-align: right;">
        <button @click="handleClose">Close Modal</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  props: {
    title: {
      type: String,
      default: 'Modal',
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div style="background: white; border: 2px solid #42b883; border-radius: 8px; padding: 20px; margin: 10px 0;">
    <h4 style="margin: 0 0 15px 0; color: #42b883;">{{ title || 'Slot Component' }}</h4>

    <div v-if="$slots.header" style="background: #f0f9f4; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
      <slot name="header"></slot>
    </div>

    <div style="padding: 15px; border: 1px dashed #42b883; border-radius: 4px; margin-bottom: 10px;">
      <slot>Default slot content goes here</slot>
    </div>

    <div v-if="$slots.footer" style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
      <slot name="footer"></slot>
    </div>

    <div style="text-align: right; margin-top: 10px;">
      <button class="danger" @click="emit('close')">Close</button>
    </div>
  </div>
</template>

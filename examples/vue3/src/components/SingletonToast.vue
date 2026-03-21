<template>
	<div class="toast" :class="{ show: visible }">
		{{ message }}
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onUnmounted } from 'vue'

const props = defineProps<{
	message: string
	duration?: number
}>()

const visible = ref(false)

onMounted(() => {
	// Animate in
	setTimeout(() => {
		visible.value = true
	}, 10)

	// Auto close
	setTimeout(() => {
		visible.value = false
	}, props.duration || 2000)
})
</script>

<style scoped>
.toast {
	position: fixed;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%) translateY(100px);
	background: #35495e;
	color: white;
	padding: 15px 30px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	transition: transform 0.3s ease;
	z-index: 3000;
}

.toast.show {
	transform: translateX(-50%) translateY(0);
}
</style>

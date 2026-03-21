<template>
	<div class="modal-overlay">
		<div class="modal">
			<div class="modal-header">
				<h3>{{ title }}</h3>
				<button class="close-btn" @click="close">×</button>
			</div>
			<div class="modal-body">
				<p>Click buttons below to emit custom events:</p>
				<div class="buttons">
					<button @click="emitEvent('Event A fired!')">Emit Event A</button>
					<button @click="emitEvent('Event B fired!')">Emit Event B</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const props = defineProps<{
	title: string
}>()

const instance = getCurrentInstance()

function emitEvent(data: string) {
	instance?.emit('custom-event', data)
}

function close() {
	instance?.emit('close')
}
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2002;
}

.modal {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 400px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
	border-bottom: 1px solid #eee;
}

.modal-header h3 {
	margin: 0;
	color: #35495e;
}

.close-btn {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #999;
}

.modal-body {
	padding: 20px;
}

.buttons {
	display: flex;
	gap: 10px;
	margin-top: 15px;
}

.buttons button {
	flex: 1;
	background: #42b883;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 4px;
	cursor: pointer;
}
</style>

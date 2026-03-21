<template>
	<div class="panel">
		<div class="panel-header">
			<h3>{{ title }}</h3>
		</div>
		<div class="panel-body">
			<p>{{ content }}</p>
			<p class="hint">Click "Update Props" button below to change these values dynamically.</p>
		</div>
		<div class="panel-footer">
			<button @click="close">Close</button>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	content: string
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

function close() {
	emit('close')
}
</script>

<style scoped>
.panel {
	position: fixed;
	bottom: 20px;
	right: 20px;
	background: white;
	border-radius: 8px;
	width: 350px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.panel-header {
	padding: 15px 20px;
	border-bottom: 1px solid #eee;
	background: #42b883;
	border-radius: 8px 8px 0 0;
}

.panel-header h3 {
	margin: 0;
	color: white;
}

.panel-body {
	padding: 20px;
}

.panel-body p {
	margin: 0 0 10px 0;
	color: #333;
}

.hint {
	color: #999;
	font-size: 12px;
}

.panel-footer {
	padding: 15px 20px;
	border-top: 1px solid #eee;
	text-align: right;
}

.panel-footer button {
	background: #42b883;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
}
</style>

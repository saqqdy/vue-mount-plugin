<template>
	<div class="modal-overlay">
		<div class="modal">
			<div class="modal-header">
				<h3>{{ title }}</h3>
			</div>
			<div class="modal-body">
				<p>{{ message }}</p>
			</div>
			<div class="modal-footer">
				<button class="confirm" @click="confirm">Confirm</button>
				<button class="cancel" @click="cancel">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string
	message: string
}>()

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'cancel'): void
	(e: 'close', value: boolean): void
}>()

function confirm() {
	emit('confirm')
	emit('close', true)
}

function cancel() {
	emit('cancel')
	emit('close', false)
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
	z-index: 2001;
}

.modal {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 400px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
	padding: 15px 20px;
	border-bottom: 1px solid #eee;
}

.modal-header h3 {
	margin: 0;
	color: #35495e;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	padding: 15px 20px;
	border-top: 1px solid #eee;
	text-align: right;
	display: flex;
	gap: 10px;
	justify-content: flex-end;
}

.cancel {
	background: #999;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
}

.confirm {
	background: #42b883;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
}
</style>

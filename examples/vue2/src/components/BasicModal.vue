<template>
	<div class="modal-overlay" @click.self="close">
		<div class="modal">
			<div class="modal-header">
				<h3>{{ title }}</h3>
				<button class="close-btn" @click="close">×</button>
			</div>
			<div class="modal-body">
				<p>{{ content }}</p>
			</div>
			<div class="modal-footer">
				<button @click="close">Close</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BasicModal',
	props: {
		title: {
			type: String,
			default: 'Modal',
		},
		content: {
			type: String,
			default: '',
		},
	},
	methods: {
		close() {
			this.$emit('close')
		},
	},
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
	z-index: 2000;
}

.modal {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
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
	padding: 0;
	line-height: 1;
}

.close-btn:hover {
	color: #333;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	padding: 15px 20px;
	border-top: 1px solid #eee;
	text-align: right;
}

.modal-footer button {
	background: #42b883;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
}
</style>

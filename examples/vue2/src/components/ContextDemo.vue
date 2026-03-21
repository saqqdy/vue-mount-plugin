<template>
	<div class="modal-overlay">
		<div class="modal">
			<div class="modal-header">
				<h3>{{ title }}</h3>
				<button class="close-btn" @click="close">×</button>
			</div>
			<div class="modal-body">
				<div class="context-item">
					<span>Router:</span>
					<span :class="{ success: hasRouter, error: !hasRouter }">
						{{ hasRouter ? '✓ Inherited' : '✗ Not found' }}
					</span>
				</div>
				<div class="context-item">
					<span>Store:</span>
					<span :class="{ success: hasStore, error: !hasStore }">
						{{ hasStore ? '✓ Inherited' : '✗ Not found' }}
					</span>
				</div>
				<div class="context-item">
					<span>I18n:</span>
					<span :class="{ success: hasI18n, error: !hasI18n }">
						{{ hasI18n ? '✓ Inherited' : '✗ Not found' }}
					</span>
				</div>
			</div>
			<div class="modal-footer">
				<button @click="reportStatus">Report Status</button>
				<button @click="close" style="margin-left: 10px">Close</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ContextDemo',
	props: {
		title: {
			type: String,
			default: 'Context Demo',
		},
	},
	computed: {
		hasRouter() {
			return !!this.$router
		},
		hasStore() {
			return !!this.$store
		},
		hasI18n() {
			return !!this.$i18n
		},
	},
	methods: {
		reportStatus() {
			const status = `Router: ${this.hasRouter ? '✓' : '✗'}, Store: ${this.hasStore ? '✓' : '✗'}, I18n: ${this.hasI18n ? '✓' : '✗'}`
			this.$emit('context-check', status)
		},
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

.context-item {
	display: flex;
	justify-content: space-between;
	padding: 10px 0;
	border-bottom: 1px solid #eee;
}

.context-item:last-child {
	border-bottom: none;
}

.success {
	color: #42b883;
	font-weight: bold;
}

.error {
	color: #e74c3c;
	font-weight: bold;
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

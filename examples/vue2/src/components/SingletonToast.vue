<template>
	<div class="toast" :class="{ show: visible }">
		{{ message }}
	</div>
</template>

<script>
export default {
	name: 'SingletonToast',
	props: {
		message: {
			type: String,
			default: '',
		},
		duration: {
			type: Number,
			default: 2000,
		},
	},
	data() {
		return {
			visible: false,
		}
	},
	mounted() {
		// Animate in
		setTimeout(() => {
			this.visible = true
		}, 10)

		// Auto close
		setTimeout(() => {
			this.visible = false
		}, this.duration)
	},
}
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

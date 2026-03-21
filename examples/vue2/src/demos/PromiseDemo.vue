<template>
	<div class="section">
		<h2>2. Promise Support</h2>
		<p class="desc">Await the result from confirm dialog</p>
		<button @click="showDialog">Show Confirm Dialog</button>
		<p v-if="result !== null">Result: <strong>{{ result ? 'Confirmed' : 'Cancelled' }}</strong></p>
	</div>
</template>

<script>
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
	data() {
		return {
			result: null,
		}
	},
	methods: {
		async showDialog() {
			this.result = null

			const confirmed = await this.$show(ConfirmDialog, {
				props: {
					title: 'Confirm Action',
					message: 'Are you sure you want to proceed?',
				},
			})

			this.result = confirmed
		},
	},
}
</script>

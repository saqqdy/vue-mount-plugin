<template>
	<div class="section">
		<h2>2. Promise Support</h2>
		<p class="desc">Await the result from confirm dialog</p>
		<button @click="showDialog">Show Confirm Dialog</button>
		<p v-if="result !== null">Result: <strong>{{ result ? 'Confirmed' : 'Cancelled' }}</strong></p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mount } from 'vue-mount-plugin'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const result = ref<boolean | null>(null)

async function showDialog() {
	result.value = null

	const confirmed = await mount(ConfirmDialog, {
		props: {
			title: 'Confirm Action',
			message: 'Are you sure you want to proceed?',
		},
	})

	result.value = confirmed
}
</script>

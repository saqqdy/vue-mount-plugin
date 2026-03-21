<template>
	<div class="section">
		<h2>1. Basic Usage</h2>
		<p class="desc">Using <code>mount()</code> to dynamically mount component</p>
		<button @click="showModal">Show Basic Modal</button>
	</div>
</template>

<script setup lang="ts">
import { mount } from 'vue-mount-plugin'
import BasicModal from '../components/BasicModal.vue'

function showModal() {
	mount(BasicModal, {
		props: {
			title: 'Basic Modal',
			content: 'This is a basic modal mounted dynamically.',
		},
	})
}
</script>

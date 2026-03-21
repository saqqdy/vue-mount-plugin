<template>
	<div class="section">
		<h2>6. Manual Control</h2>
		<p class="desc">Create instance first, control show/hide/unmount manually</p>
		<button @click="createInstance" :disabled="instance !== null">Create Instance</button>
		<button @click="showInstance" :disabled="!instance" style="margin-left: 10px">Show</button>
		<button @click="hideInstance" :disabled="!instance" style="margin-left: 10px">Hide</button>
		<button @click="destroyInstance" :disabled="!instance" style="margin-left: 10px">Destroy</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createMount } from 'vue-mount-plugin'
import PropsDemo from '../components/PropsDemo.vue'

const instance = ref<any>(null)

function createInstance() {
	instance.value = createMount(PropsDemo, {
		props: {
			title: 'Manual Control',
			content: 'This instance is created but not shown yet. Click Show to display it.',
		},
	})
}

function showInstance() {
	instance.value?.show()
}

function hideInstance() {
	instance.value?.hide()
}

function destroyInstance() {
	instance.value?.unmount()
	instance.value = null
}
</script>

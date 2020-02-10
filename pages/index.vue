<template lang="pug">
div
	Head
	Workflow
</template>

<script>
import Head from '~/components/Head.vue'
import Workflow from '~/components/Workflow.vue'

export default {
  components: {
		Head,
		Workflow,
	},
	data() {
		return {
			//table: false,
		}
	},
}
</script>

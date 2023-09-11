<template>
	<div class="alertContainer">
		<Alert v-for="a in alerts" :key="a.id" v-bind="a"></Alert>
	</div>
</template>
<script>
import { mapState } from 'vuex';

export default {
	props: {
		group: {
			type: String,
			default: "global"
		}
	},
	computed: {
		...mapState({
			alerts(state) {
				return this.group ? state.alerts[this.group] : [];
			}
		})
	}
}
</script>

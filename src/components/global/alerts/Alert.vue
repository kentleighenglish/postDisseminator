<template>
	<div :class="componentClass">
		{{ message }}
	</div>
</template>
<script>
import classModsMixin from '@/mixins/classModsMixin';

export default {
	mixins: [ classModsMixin ],
	props: {
		message: {
			type: String,
			default: ""
		},
		type: {
			type: String,
			default: "error",
			validator: (prop) => [
				"error",
				"success"
			].includes(prop)
		},
		timestamp: {
			type: [ String, Boolean ],
			default: false
		},
		id: {
			type: String,
			default: ""
		}
	},
	classMod: {
		baseClass: "alert",
		modifiers: {
			type: vm => vm.type
		}
	}
}
</script>
<style lang="scss">
	.alert {
		color: $grey-dark;
		margin: ($gap / 2) 0;
		text-shadow: 1px 1px 5px fade-out($grey-dark, .9);

		&--error {
			color: $danger;
		}

		&--success {
			color: $success;
		}
	}
</style>

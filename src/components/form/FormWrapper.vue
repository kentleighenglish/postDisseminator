<template>
	<ValidationObserver ref="observer" tag="form" @submit.prevent="onSubmit()" v-slot="{ errors }" novalidate>
		<slot></slot>
	</ValidationObserver>
</template>
<script>
import { mapActions } from "vuex";
import { ValidationObserver } from "vee-validate";

export default {
	components: {
		ValidationObserver
	},
	props: {
		submit: {
			type: Function,
			default: () => ({})
		},
		errorGroup: {
			type: String,
			default: null
		}
	},
	methods: {
		...mapActions({
			addAlert: "addAlert",
			clearAlerts: "clearAlerts"
		}),
		onSubmit() {
			this.reset();
			this.$emit('update:validating', true);

			this.$refs.observer.handleSubmit().then(() => {
				this.$emit('update:validating', false);
				setTimeout(() => {
					const { errors: fieldErrors = {}, flags: { valid } } = this.$refs.observer;

					Object.keys(fieldErrors).map(field => {
						const errors = fieldErrors[field];

						if (this.errorGroup) {
							errors.map((error) => {
								this.addAlert({
									group: this.errorGroup,
									message: error
								});
							});
						}
					});

					if (valid) {
						// this.submit();
					}
				}, 100);
			});
		},
		reset() {
			const { observer } = this.$refs;

			observer.reset();
			if (this.errorGroup) {
				this.clearAlerts(this.errorGroup);
			}
		}
	}
}
</script>

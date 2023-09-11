<template>
	<FormWrapper ref="loginForm" id="loginForm" :submit="submitForm" :error-group="loginMode ? 'loginForm' : 'registerForm'" :validating.sync="validating">
		<div class="pb-padding-h">
			<FormInput v-model="form.username" name="username" type="text" label="Username" :lg="size === 'lg'" :disabled="submitting || validating" policy="required" required></FormInput>
		</div>
		<div class="pb-padding-h">
			<FormInput v-model="form.password" name="password" type="password" label="Password" :lg="size === 'lg'" :disabled="submitting || validating" :policy="loginMode ? 'loginPassword' : 'requiredPassword'" required></FormInput>
			<FormInput v-if="!loginMode" v-model="form.confirmPassword" name="confirmPassword" type="password" label="Confirm Password" :lg="size === 'lg'" :disabled="submitting || validating" policy="requiredConfirmPassword" required></FormInput>
			<PButton block lg type="submit" state="primary" :loading="submitting || validating" :disabled="submitting || validating">Submit</PButton>
			<div class="pb-flex pb-align-space-between">
				<NuxtLink v-if="loginMode" to="/register">Click here to create an account</NuxtLink>
				<NuxtLink v-if="!loginMode" to="/login">Click here to sign in to an existing account</NuxtLink>
				<NuxtLink v-if="loginMode" to="/forgot-password">Forgot Password?</NuxtLink>
			</div>
			<AlertContainer v-if="loginMode" group="loginForm"></AlertContainer>
			<AlertContainer v-if="!loginMode" group="registerForm"></AlertContainer>
		</div>
	</FormWrapper>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
	props: {
		loginMode: {
			type: Boolean,
			default: true
		},
		redirect: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: "lg"
		}
	},
	data: () => ({
		form: {
			username: null,
			password: null,
			confirmPassword: null
		},
		submitting: false,
		validating: false
	}),
	methods: {
		...mapActions({
			register: "register",
			addAlert: "addAlert",
			clearAlerts: "clearAlerts"
		}),
		async submitForm() {
			if (!this.submitting && !this.validating) {
				try {
					this.submitting = true;
					const data = this.form;

					if (this.loginMode) {
						await this.$auth.loginWith('local', { data });
					} else {
						await this.register({ data });
						await this.$auth.loginWith('local', { data });
					}

					if (this.redirect) {
						this.$router.push('/');
					}

					this.submitting = false;
				} catch(e) {
					this.submitting = false;
				}
			}
		}
	}
}
</script>

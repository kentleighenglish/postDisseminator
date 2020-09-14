<template>
	<div class="registerForm">
		<h1>Register</h1>
		<LoginForm :loginMode="false" />
	</div>
</template>
<script>

	export default {
		layout: "public",
		auth: false
	}

</script>
<style lang="scss">

	.registerForm {
		display: flex;
		max-width: $narrow-content;

		flex-direction: column;
		margin: 0 auto;
	}

</style>

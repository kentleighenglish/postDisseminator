<template>
	<div class="loginForm">
		<h1>Login</h1>
		<LoginForm :loginMode="true" />
	</div>
</template>
<script>

	export default {
		layout: "public",
		auth: false
	}

</script>
<style lang="scss">

	.loginForm {
		display: flex;
		max-width: $narrow-content;

		flex-direction: column;
		margin: 0 auto;
	}

</style>

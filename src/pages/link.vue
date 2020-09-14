<template>
	<div class="linkPage">
		<div class="platform" v-for="platform in platforms">
			<div class="platform__content">
				<img :src="`/svg/platforms/${platform.key}.svg`" class="platform__icon" />
				<h2 class="platform__label">{{ platform.label }}</h2>
			</div>
		</div>
		<GlobalModal></GlobalModal>
	</div>
</template>
<script>
	import { mapActions, mapState } from "vuex";

	export default {
		mounted() {

		},
		computed: {
			...mapState({
				platforms: state => state.platforms.platforms
			})
		},
		methods: {
			...mapActions({
			}),
			linkAccount(platform) {
				console.log(platform);
			}
		}
	}

</script>
<style lang="scss">

	.linkPage {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: row;
		flex-wrap: wrap;

		align-items: center;
		justify-content: center;
		padding: 0 10%;

		.platform {
			position: relative;
			width: 20%;

			&:before {
				display: block;
				content: "";
				padding-top: 100%;
			}

			.platform__content {
				position: absolute;
				top: 0;
				left: 0;

				display: flex;
				flex-direction: column;
				padding: ($gap / 2);
				width: 100%;
				height: 100%;

				align-items: center;
				justify-content: center;
				border-radius: ($gap / 4);

				.platform__label {
					font-weight: 400;
				}

				.platform__icon {
					width: 100%;
					height: 160px;
				}

				&:hover {
					cursor: pointer;
					background-color: darken($bg, 5%);
				}
			}
		}
	}

</style>

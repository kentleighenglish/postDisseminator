<template>
	<div class="linkPage">
		<div class="platform" v-for="platform in platforms" :class="{ 'platform--disabled': platform.disabled }" @click="linkAccount(platform)">
			<div class="platform__content">
				<img :src="`/svg/platforms/${platform.key}.svg`" class="platform__icon" />
				<h2 class="platform__label">{{ platform.label }}</h2>
			</div>
		</div>
		<GlobalModal name="linkModal">
			<!-- <iframe src="https://api.twitter.com/oauth/authenticate?oauth_token=asd" width="100%" height="400px"></iframe> -->
		</GlobalModal>
	</div>
</template>
<script>
	import { mapActions, mapState } from "vuex";
	import Twitter from "twitter-lite";
	import * as platforms from "@@/platforms";

	const modals = {
		twitter: "twitterLinkModal"
	}

	export default {
		data: () => ({
			modalData: null
		}),
		computed: {
			...mapState({
				platforms: state => state.platforms.platforms
			})
		},
		methods: {
			...mapActions({
				openModal: "openModal"
			}),
			async linkAccount(platform) {
				const methods = platforms[platform.key] || {};

				if (methods.link) {
					const token = await methods.link({
						config: this.$config,
						openModal: (data) => {
							this.modalData = data;
							this.openModal("linkModal");
						}
					});
				}
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

			&--disabled {
				pointer-events: none;
				opacity: .2
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

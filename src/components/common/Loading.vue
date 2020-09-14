<template>
	<div v-if="mode === 'page'" class="loadingWrapper">
		<div class="loading"></div>
	</div>
	<transition v-else appear name="loading-slide">
		<div :class="componentClass"></div>
	</transition>
</template>
<script>
import classModsMixin from '@/mixins/classModsMixin';

export default {
	mixins: [ classModsMixin ],
	classMod: {
		baseClass: 'loading',
		modifiers: {
			inline: vm => !!vm.inline,
			small: vm => !!vm.small,
			"h-fade": vm => !!vm.hFade
		}
	},
	props: {
		mode: {
			default: "inline",
			type: String
		},
		inline: {
			type: Boolean,
			default: false
		},
		small: {
			type: Boolean,
			default: false
		},
		hFade: {
			type: Boolean,
			default: false
		}
	}
}
</script>
<style lang="scss">
	@keyframes loadingAnim {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loadingWrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading {
		position: relative;
		width: 100%;
		margin: $gap 0;
		display: flex;
		justify-content: center;

		&.loading-slide-enter-active, &.loading-slide-leave-active {
			overflow: hidden;
			transition: all .4s ease;
		}

		&:not(.loading--h-fade) {
			&.loading-slide-enter, &.loading-slide-leave-to {
				transform: scaleY(0);
			}
			&.loading-slide-enter-to, &.loading-slide-leave {
				transform: scaleY(1);
			}
		}
		&.loading--h-fade {
			&.loading-slide-enter, &.loading-slide-leave-to {
				transform: scaleX(0);
				margin-left: -40px;

				&.loading--small {
					margin-left: -20px;
				}
			}
			&.loading-slide-enter-to, &.loading-slide-leave {
				transform: scaleX(1);
				margin-left: 0px;
			}
		}

		&:before, &:after {
			box-sizing: content-box;
			display: block;
			content: "";
			width: 40px;
			height: 40px;
			border: 6px solid $primary;
			border-radius: 50%;
			transform: rotate(0deg);

			animation: loadingAnim 2s infinite linear;
		}

		&:before {
			border-color: $primary transparent;
		}

		&:after {
			position: absolute;
			border-width: 2px;
			margin-top: 4px;
			border-color: transparent $primary;

			animation-duration: 1.5s;
			// animation-direction: reverse;
		}

		&--inline {
			display: inline-flex;
			margin: 0 4px;
			width: initial;
			vertical-align: middle;
		}

		&--small {
			&:before, &:after {
				width: 20px;
				height: 20px;
				border-width: 3px;
			}
			&:after {
				border-width: 1px;
				margin-top: 2px;
			}
		}
	}
</style>

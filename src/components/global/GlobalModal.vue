<template>
	<portal to="modal" v-if="visible">
		<transition appear name="modal-load" v-on:leave="onLeave">
			<div class="modal">
					<div class="modal__content" :class="modalClass">
						<div class="le-padding-h">
							<slot></slot>
						</div>
						<div class="modal__footer">
							<div class="le-flex le-padding-h">
								<PButton state="primary" block @click="onConfirm()" :disabled="submitting || confirmDisabled" :loading="submitting">{{ confirmLabel }}</PButton>
							</div>
							<div class="le-flex le-padding-h">
								<PButton block @click="onClose()" :disabled="submitting || closeDisabled">{{ closeLabel }}</PButton>
							</div>
						</div>
					</div>
				<div v-if="overlay" class="overlay" @click="overlayClick()"></div>
			</div>
		</transition>
	</portal>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
	data: () => ({
		submitting: false
	}),
	props: {
		name: {
			type: String,
			default: "default"
		},
		overlay: {
			type: Boolean,
			default: true
		},
		closeWithOverlay: {
			type: Boolean,
			default: true
		},
		confirm: {
			type: Function,
			default: () => {}
		},
		confirmDisabled: {
			type: Boolean,
			default: false
		},
		closeDisabled: {
			type: Boolean,
			default: false
		},
		confirmLabel: {
			type: String,
			default: "Ok"
		},
		closeLabel: {
			type: String,
			default: "Close"
		},
		modalClass: {
			type: [ String, Object ],
			default: ""
		}
	},
	computed: {
		...mapState({
			visible(state) {
				return state.visibleModal === this.name;
			}
		})
	},
	methods: {
		...mapActions({
			closeModal: "closeModal"
		}),
		overlayClick() {
			if (this.closeWithOverlay) {
				this.closeModal();
			}
		},
		async onConfirm() {
			this.submitting = true;
			try {
				const result = await this.confirm();

				this.submitting = false;

				if (result !== false) {
					this.closeModal();
				}
			}
			catch(e) {
				console.error(e);
				this.submitting = false;
				this.error = e;
			}
		},
		onClose() {
			this.closeModal();
		},
		onLeave(el, done) {
			setTimeout(() => {
				done();
			}, 800);
		}
	}
}

</script>
<style lang="scss">

	.modal-load-enter-active, .modal-load-leave-active {
		.modal__content {
			overflow: hidden;
			transition: 2s ease;
		}
	}
	.modal-load-enter, .modal-load-leave-to {
		.modal__content {
			// transform: scaleX(0) scaleY(.5);
			transform: translateY(-100%);
			opacity: 0;
		}
	}
	.modal-load-enter-to, .modal-load-leave {
		.modal__content {
			transform: translateY(0%);
			opacity: 1;
		}
	}

	.modal {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&__content {
			position: relative;
			z-index: 2;
			width: 500px;
			max-width: 100%;

			padding: $gap;
			background: $bg;
			border-radius: 3px;

			@include mq($from: "sm") {
				min-width: 500px;
				width: initial;
				max-width: initial;
			}

			@include realShadow();
		}

		&__footer {
			display: flex;
		}
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: fade-out(black, .6);
		z-index: 1;
	}

</style>

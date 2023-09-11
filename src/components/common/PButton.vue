<template>
	<router-link v-if="to" :class="componentClass" :to="to">
		<slot></slot>
	</router-link>
	<button v-else :class="componentClass" :type="type" @click="onClick" :disabled="disabled">
		<slot></slot>
		<Loading small inline h-fade v-if="loading"></Loading>
	</button>
</template>
<script>
import classModsMixin from '@/mixins/classModsMixin';

export default {
	mixins: [ classModsMixin ],
	classMod: {
		baseClass: 'button',
		modifiers: {
			disabled: vm => !!vm.disabled,
			block: vm => !!vm.block,
			state: vm => vm.state,
			inline: vm => !!vm.inline,
			lg: vm => !!vm.lg
		}
	},
	props: {
		type: String,
		to: {
			type: [ String, Object ],
			default: () => null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		block: {
			type: Boolean,
			default: false
		},
		state: {
			type: String,
			default: "default"
		},
		lg: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		inline: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		onClick(e) {
			this.$emit('click', e);
		}
	}
}
</script>
<style lang="scss">

a.button {
	text-decoration: none;
	text-align: center;
}

a.button, button.button {
	display: flex;
	border: none;
	border-radius: 4px;
	margin: ($gap / 2) 0;
	white-space: nowrap;
	justify-content: center;
	align-items: center;

	background-color: $grey;
	color: $grey-dark;
	padding: 0 $gap;
	height: $input-size;

	font-size: 1em;
	font-weight: 400;

	transition: box-shadow .4s;

	&:hover {
		cursor: pointer;
		background-color: darken($grey, 5%);
	}

	@include generateStateModifiers() using ($color) {
		background-color: $color;
		color: white;

		&:hover {
			background-color: darken($color, 5%);
		}
	}

	&:active, &:focus {
		outline: none;
	}

	&--lg {
		font-size: 1.1em;
		height: $input-size-lg;
	}

	&--block {
		width: 100%;
	}

	&--inline {
		background: none;
		box-shadow: none;
		padding: 0;
		font-size: .9em;
		margin: ($gap / 2) 0 ($gap / 4);
		color: $grey-dark;

		&:hover {
			background-color: initial;
		}

		@include generateStateModifiers() using ($color) {
			color: $color;

			&:hover {
				color: darken($color, 5%);
			}
		}
	}

	&--disabled {
		background-color: $grey-light;
		color: $grey;

		&:hover {
			background-color: $grey-light;
			cursor: not-allowed;
		}
	}

	.loading {
		&:before {
			border-color: white transparent;
		}
		&:after {
			border-color: transparent white;
		}
	}
}

</style>

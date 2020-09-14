<template>
	<ValidationProvider tag="div" ref="validation" :name="name" :rules="inputRules" mode="passive" v-slot="v" :class="componentClass">
		<label v-if="type === 'checkbox'">
			<input v-model="model" :class="validationClass(v)" :name="name" :type="type" :required="required" :disabled="disabled" @input="updateValue($event.target.value)"></input>
			<div :class="{ checkbox: true, checked: !!model }">
				<span class="fas fa-check" v-if="!!model"></span>
			</div>
			<span class="input__label">
				<slot>
					<span>{{ label }}</span>
				</slot>
			</span>
		</label>
		<label v-else-if="type === 'textarea'" :for="name">
			<span class="input__label">
				<slot>
					<span>{{ label }}</span>
				</slot>
			</span>
			<textarea
				v-model="model"
				:class="validationClass(v)"
				:name="name"
				:type="type"
				:required="required"
				:disabled="disabled"
				@input="updateValue($event.target.value)"
				:rows="rows"
			></textarea>
		</label>
		<label v-else-if="type === 'select'" :for="name">
			<span class="input__label">
				<slot>
					<span>{{ label }}</span>
				</slot>
			</span>
			<select
				v-model="model"
				:class="validationClass(v)"
				:name="name"
				:type="type"
				:required="required"
				:disabled="disabled"
				@input="updateValue($event.target.value)"
				:rows="rows"
			>
				<option v-for="(label, key) in options" :value="key">{{ label }}</option>
			</select>
		</label>
		<label v-else :for="name">
			<span class="input__label">
				<slot>
					<span>{{ label }}</span>
				</slot>
			</span>
			<input
				v-model="model"
				:class="validationClass(v)"
				:name="name"
				:type="passwordVisible ? 'text' : type"
				:required="required"
				:placeholder="placeholder"
				:disabled="disabled"
				@input="updateValue($event.target.value)"></input>
			<span v-if="type === 'password' && !suffix" class="input__suffix input__suffix--hover">
				<span v-if="!passwordVisible" class="fas fa-eye" @click="passwordVisible = true"></span>
				<span v-else="passwordVisible" class="fas fa-eye-slash" @click="passwordVisible = false"></span>
			</span>
		</label>
	</ValidationProvider>
</template>
<script>
import classModsMixin from "@/mixins/classModsMixin";
import { ValidationProvider, extend } from 'vee-validate';

import validationRules from "@/validation/rules";
import * as policies from "@/validation/policies";

Object.keys(validationRules).forEach(rule => extend(rule, validationRules[rule]));

export default {
	mixins: [ classModsMixin ],
	components: {
		ValidationProvider
	},
	props: {
		name: String,
		type: {
			type: String,
			default: "text"
		},
		label: String,
		placeholder: String,
		required: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		lg: {
			type: Boolean,
			default: false
		},
		rows: {
			type: [ Number, String ],
			default: 3
		},
		value: "",
		suffix: {
			type: String,
			default: null
		},
		policy: {
			type: String,
			default: null
		},
		options: {
			type: Object,
			default: () => ({})
		}
	},
	classMod: {
		baseClass: "input",
		modifiers: {
			lg: vm => !!vm.lg,
			hasSuffix: vm => !!vm.hasSuffix,
			type: vm => vm.type
		}
	},
	data: () => ({
		model: null,
		passwordVisible: false
	}),
	created() {
		this.model = this.value;
	},
	mounted() {
		this.model = this.value;
	},
	methods: {
		updateValue: function(value) {
			this.$emit('input', value);
		},
		validationClass(v) {
			return "input__element" + (v.invalid && v.validated ? " input__element--error" : "")
		}
	},
	computed: {
		hasSuffix() {
			return (!!this.suffix || this.type === "password");
		},
		inputRules() {
			if (this.policy && policies[this.policy]) {
				return policies[this.policy];
			}

			return {};
		}
	},
	watch: {
		value(v) {
			this.model = v;
		}
	}
}
</script>
<style lang="scss">
	.input {
		width: 100%;

		input[disabled], textarea[disabled] {
			opacity: .6;
		}

		label {
			position: relative;
			display: flex;
			flex-direction: column;
			// margin: ($gap / 2) 0;
		}

		.input__label {
			font-size: 1.2em;
			font-weight: 600;
			margin: ($gap / 4) 0;
			color: $primary;
		}

		textarea.input__element {
			font-weight: 400;
			font-size: 1em;
			height: initial;
		}

		.input__element {
			font-size: 1.2em;
			font-weight: 600;
			font-family: $default-font;
			padding: ($gap / 3) ($gap / 2);
			border-radius: 3px;
			border: 1px solid $primary;
			background-color: $bg;
			color: $primary;
			height: $input-size;

			transition: border-color .2s, box-shadow .5s;

			&:focus {
				border-color: $primary-light;
				outline: none;
				color: $primary;
			}

			&::placeholder {
				color: $primary-light;
			}

			&--error {
				border-color: $danger;
			}
		}

		.input__suffix {
			position: absolute;
			bottom: 0;
			right: 0;
			height: $input-size;
			font-size: 1.2em;
			padding: ($gap / 3) ($gap / 2);
			color: $grey;

			&--hover {
				&:hover {
					cursor: pointer;
					color: $primary;
				}
			}
		}

		&--hasSuffix {
			.input__element {
				padding-right: $gap * 2;
			}
		}

	}

	.input--checkbox {

		label {
			cursor: pointer;
			margin: $gap 0;
			flex-direction: row;
			align-items: center;
		}

		.input__element {
			display: none;
		}

		.input__label {
			margin-left: $gap;
		}

		.checkbox {
			position: relative;
			display: inline-block;
			width: $input-size;
			height: $input-size;
			min-width: $input-size;
			min-height: $input-size;
			border-radius: 3px;
			border: 1px solid $grey;

			.fa-check {
				position: absolute;
				top: 0;
				left: 0;
				display: block;

				font-size: ($input-size * .6);
				font-weight: 800;
				color: $primary;
				width: $input-size;
				height: $input-size;
				text-align: center;
				line-height: 1.7em;
			}
		}
	}

	.input--lg {
		.input__label {
			font-size: 1.3em;
		}
		.input__element {
			font-size: 1.5em;
			height: $input-size-lg;
		}

		&.input--checkbox {
			.checkbox {
				width: $input-size-lg;
				height: $input-size-lg;
				min-width: $input-size-lg;
				min-height: $input-size-lg;

				.fa-check {
					width: $input-size-lg;
					height: $input-size-lg;
					font-size: ($input-size-lg * .6);
				}
			}
		}
	}
</style>

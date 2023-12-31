
export default {
	computed: {
		componentClass() {
			if (this.$options.classMod) {
				const { baseClass = "", modifiers = {} } = this.$options.classMod;

				const modifierKeys = Object.keys(modifiers);

				return Object.keys(modifiers).reduce((arr, key) => {
					const modifier = modifiers[key];

					const result = modifier(this);

					if (typeof result === "string") {
						return [ ...arr, `${baseClass}--${result}`];
					}

					if (result) {
						return [ ...arr, `${baseClass}--${key}` ];
					} else {
						return arr;
					}
				}, [ baseClass ]).join(' ');
			}

			return '';
		}
	}
}

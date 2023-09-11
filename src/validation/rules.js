import { confirmed, required, email } from "vee-validate/dist/rules.umd";
import zxcvbn from "zxcvbn";

const usernamePolicy = /^[A-z0-9\-\_]*$/;

const rules = {
	confirmed: {
		...confirmed,
		message: "The passwords do not match"
	},
	required: {
		...required,
		message: "The highlighted fields are required"
	},
	email: {
		...email,
		message: "The email address provided is not valid"
	},
	username: {
		validate: val => {
			const m = val.match(usernamePolicy);

			if(!m) {
				return { valid: false };
			} else {
				return { valid: true }
			}
		},
		message: "Username can only have letters, numbers, unscores, and dashes"
	},
	password: {
		validate: val => {
			const result = zxcvbn(val);

			if(result.score < 3) {
				let message = "";

				if (result.feedback.warning && result.feedback.warning.length) {
					message = `${result.feedback.warning}.`
				}

				if (result.feedback.suggestions.length) {
					result.feedback.suggestions.map(suggestion => {
						message = message.length ? `${message}
						${suggestion}` : suggestion;
					});
				}

				return message;
			} else {
				return { valid: true };
			}
		}
	}
}

export default rules;

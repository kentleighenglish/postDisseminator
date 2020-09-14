import { requireAll } from '../utils/utils';
import { get } from 'lodash';
import { validate, extend } from "vee-validate";

const policyFunctions = requireAll(require.context('./policies', false, /\.(js)$/i));
import validationPolicies from "src/validation/policies";

// Set up vee-validate rules
import validationRules from "src/validation/rules";
Object.keys(validationRules).forEach(rule => extend(rule, validationRules[rule]));

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const checkRoute = async (request, response, { policies = [], params = {}, validation = {} }) => {
	// Check policies
	await Promise.all(policies.map(async (policyRule) => {
		const { policy, message, params } = typeof policyRule === "string" ? { policy, message: null, params: null } : policyRule;

		if (policyFunctions[policy]) {
			const response = await policyFunctions[policy](request, response, params);

			if (!response) {
				throw message ? message : `Policy for request failed: ${policy}`;
			}
		}
		return;
	}));

	try {
		// Check parameter types
		await Promise.all(Object.keys(params).map(async (param) => {
			const type = params[param];

			const types = Array.isArray(type) ? type : [ type ];

			const prop = get(request.body, param, null);

			if (prop) {
				const result = types.filter(type => {
					switch(type) {
						case "string":
						return typeof prop === "string";
						case "number":
						return typeof prop === "number";
						case "boolean":
						return typeof prop === "boolean";
						case "object":
						return typeof prop === "object";
						case "array":
						return Array.isArray(prop);
						case "email":
						return typeof prop === "string" &&
						emailRegex.test(prop);
					}
				});

				if (!result.length) {
					throw `${param} did not match types: ${types.join(',')} with a value of: "${prop}"`;
				}
			}

			return;
		}));

		// Check validation policies
		await Promise.all(Object.keys(validation).map(async (param) => {
			const validationRule = validation[param];

			const prop = get(request.body, param, null);

			const rule = validationPolicies[validationRule];

			if (rule) {
				const result = await validate(prop, rule, {
					values: request.body
				});

				if (!result.valid && result.errors.length) {
					throw result.errors[0];
				}
			} else {
				throw `Invalid validation rule ${validationRule}`;
			}

			return;
		}));
	} catch(e) {
		console.error("ERROR: ", e);
		throw "An unknown error occurred";
	}
}

// import core from "../core";
import { reduce } from "lodash";
import platforms from "./platforms";

import core from "../../core";

export default ({ app } = {}, inject) => {
	const response = reduce(platforms, (acc, platform, key) => ({
		...acc,
		[key]: reduce(platform, (acc2, prop, propName) => ({
			...acc2,
			[propName]: typeof prop === "function" ? prop({ core }) : prop
		}), {})
	}), {});

	if (app && inject) {
	  inject('platforms', response);
	}

	return response;
}

import { reduce } from "lodash";
import platforms from "~/plugins/platforms.client.js"

export const state = () => ({
	platforms: reduce(platforms(), (acc, platform, key) => {
		const { label, link, disabled = false } = platform;

		return [
			...acc,
			{
				key,
				label,
				disabled
			}
		];
	}, [])
})

export const actions = {

}

export const mutations = {

}

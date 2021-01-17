import * as platforms from "~~/platforms"


export const state = () => ({
	platforms: Object.keys(platforms).reduce((acc, key) => {
		const { label, link, disabled = false } = platforms[key];

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

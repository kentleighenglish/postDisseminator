import * as platforms from "~~/platforms"


export const state = () => ({
	platforms: Object.keys(platforms).reduce((acc, key) => {
		const { label, link } = platforms[key];

		return [
			...acc,
			{
				key,
				label
			}
		];
	}, [])
})

export const actions = {

}

export const mutations = {

}

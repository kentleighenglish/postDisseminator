import platforms from "../../plugins/platforms.server.js";

const {
	SITE_HOST
} = process.env;

export const link = async (request, response, next) => {
	const { platform } = request.body;

	if (platform && platforms[platform] && platforms[platform].apiLink) {
		const requestToken = await platforms[platform].apiLink({
			callbackUrl: SITE_HOST+"/link-callback",
			env: process.env
		});

	}

	return null;
}

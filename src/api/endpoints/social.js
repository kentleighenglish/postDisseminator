import platforms from "../../plugins/platforms.server.js";

const platformsObj = platforms();

const {
	SITE_HOST
} = process.env;

export const link = async (request, response, next) => {
	const { platform } = request.body;

	if (platform && platformsObj[platform] && platformsObj[platform].apiLink) {
		const requestToken = await platformsObj[platform].apiLink({
			callbackUrl: SITE_HOST+"/link-callback",
			env: process.env
		});

		return requestToken;
	}

	return null;
}

import core from "../../../core";

const getTokenFromRequest = ({ headers: { authorization, cookie }}) => {
	const authSplit = authorization.split(" ");

	if (authSplit && authSplit.length) {
		return authSplit[1];
	}

	const matches = cookie.match(/auth._token.local=(.+);?/);

	if (matches) {
		const authCookie = decodeURIComponent(matches[1]);
		const cookieSplit = authCookie.split(" ");

		if (cookieSplit && cookieSplit.length) {
			return cookieSplit[1];
		}
	}

	return null;
}

export const login = async (request, response, next) => {
	const data = request.body;

	const result = await core.mongo.user.login(data);

	return result;
}

export const logout = async (request, response, next) => {
	const token = getTokenFromRequest(request);

	const result = await core.mongo.user.logout({ token });
}

export const register = async (request, response, next) => {
	const { data = {} } = request.body;

	const result = await core.mongo.user.register(data);

	return result;
}

export const user = async (request, response, next) => {
	const token = getTokenFromRequest(request);

	const result = await core.mongo.user.user({ token });

	return result;
}

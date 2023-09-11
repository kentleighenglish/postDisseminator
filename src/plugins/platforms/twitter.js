import axios from "axios";
import Twitter from "twitter-lite";
import { request } from "../../utils/request";

export const label = "Twitter";

export const link = () => async ({ config }) => {
	const response = await request("social/link", { platform: "twitter" });

	if (response) {
		const { token } = response;
		const url = `https://api.twitter.com/oauth/authenticate?oauth_token=${token}`;

		window.open(url, "_blank");
	}
}

export const apiLink = ({ core }) => async ({ env, callbackUrl }) => {
	const {
		TWITTER_KEY: consumer_key,
		TWITTER_SECRET: consumer_secret
	} = env;

	const client = new Twitter({ consumer_key, consumer_secret });

	const { oauth_token, oauth_token_secret } = await client.getRequestToken(callbackUrl);

	await saveToken({ core })({
		oauth_token,
		oauth_token_secret
	});

	return {
		token: oauth_token
	}
}

export const saveToken = ({ core }) => async (payload) => {

}

export const getToken = () => async () => {

}

export const publishPost = () => async () => {

}

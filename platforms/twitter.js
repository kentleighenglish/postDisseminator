import axios from "axios";
// import core from "../core";
import Twitter from "twitter-lite";

export const label = "Twitter";

export const link = async ({ config }) => {
	const response = axios.post("/api/social/link", {
		platform: "twitter"
	});

	console.log(response);
}

export const apiLink = async ({ env, callbackUrl }) => {
	const {
		TWITTER_KEY: consumer_key,
		TWITTER_SECRET: consumer_secret
	} = env;

	const client = new Twitter({ consumer_key, consumer_secret });

	const { oauth_token, oauth_token_secret } = await client.getRequestToken(callbackUrl);

	await saveToken({
		oauth_token,
		oauth_token_secret
	});

	return {
		token: oauth_token
	}
}

export const saveToken = async () => {
}

export const getToken = async () => {

}

export const publishPost = async () => {

}

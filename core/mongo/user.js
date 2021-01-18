import { run } from "./utils";
import argon2 from "argon2";
import Cryptr from "cryptr";
import moment from "moment";
import { pick } from "lodash";

const clientFields = ["id", "username"];

const USER_TABLE = "users";
const SESSION_TABLE = "sessions";

const { AUTH_SALT } = process.env;

const cryptr = new Cryptr(AUTH_SALT);

const getUser = async username => {
	const user = await run(db => db.collection(USER_TABLE).findOne({ username }));

	return user;
}

const getUserFromToken = async token => {
	const session = await getSession(token);


	if (session) {
		const { user_id } = session;

		const user = await run(db => db.collection(USER_TABLE).findOne({ id: user_id }));

		if (user) {
			return { user: pick(user, clientFields) };
		}
	}

	return null;
}

const getSession = async token => {
	const result = await run(db => db.collection(SESSION_TABLE).findOne({ token }));

	if (result) {
		const rawToken = cryptr.decrypt(result.token) || "";
		const rawTokenSplit = rawToken.split(" ");

		if (rawTokenSplit && rawTokenSplit.length) {
			const tokenDate = moment(parseInt(rawTokenSplit[1]));

			const daysAgo = moment().diff(tokenDate, "days");

			if (daysAgo <= 7) {
				return result;
			} else {
				await deleteSession(result.id);
				throw "Your login session has expired";
			}
		}
	}

	return null;
}

const createSession = async id => {
	try {
		const ms = moment().valueOf();

		const hash = await argon2.hash(id);

		const token = cryptr.encrypt(`${hash.substr(-8)} ${ms}`)

		const result = await run(db => db.collection(SESSION_TABLE).insert({
			token,
			user_id: id
		}));

		return token;
	} catch(e) {
		console.error(e);
		return false;
	}
}

const deleteSession = async id => {
	return await run(db => db.collection(SESSION_TABLE).findOne({ id }).delete());
}

export const register = async ({ username = null, password = null, confirmPassword = null }) => {
	switch(false) {
		case (!!username):
			throw "Username is required";
		break;
		case (!!password):
			throw "Password is required";
		break;
		case (password === confirmPassword):
			throw "Passwords do not match";
		break;
	}

	const existingUser = await getUser(username);

	if (existingUser) {
		throw "Username is taken";
	}

	try {
		const p = await argon2.hash(password);

		const result = await run(db => db.collection(USER_TABLE).insert({
			username,
			password: p
		}));

		return true;
	} catch(e) {
		console.error(e);
		throw "An error occurred while creating your account";

		return false;
	}
}

export const login = async ({ username = null, password = null }) => {
	switch(false) {
		case (!!username):
			throw "Username is required";
		break;
		case (!!password):
			throw "Password is required";
		break;
	}

	try {
		const user = await getUser(username);

		if (!user) {
			throw "Incorrect username or password";
		}

		const validPassword = await argon2.verify(user.password, password);

		if (!validPassword) {
			throw "Incorrect username or password";
		}

		const token = await createSession(user.id);

		if (token) {
			return { token };
		} else {
			throw "An error occurred while logging you in";
		}
	} catch(e) {
		throw e;
	}
}

export const logout = async ({ token = null }) => {
	const session = await getSession(token);

	if (session) {
		await deleteSession(session.id);
	}
}

export const user = async ({ token = null }) => {
	if (!token) {
		throw "No token provided";
	}

	const user = getUserFromToken(token);

	if (user) {
		return user;
	}
}

export default {
	register,
	login,
	logout,
	user
}

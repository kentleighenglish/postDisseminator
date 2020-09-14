// #if process.env.VUE_ENV !== 'client'
import moment from 'moment';
// #endif
import { get, reduce } from 'lodash';

import es6 from 'es6-promise';
import('isomorphic-fetch');

const PREFIX = '/api/';

const requestsLog = {};

const coreRequest = (user) => async (endpoint, data = {}) => {
	const endpointFunc = get(core(user), endpoint.replace(/\//g, '.'));

	if (!endpointFunc) {
		console.error(`${endpoint} core endpoint does not exist`);
		return;
	}

	return endpointFunc(data);
}

const apiRequest = () => async (endpoint, data = {}, stringify = true) => {
	const url = `${PREFIX}${endpoint}`;

	const key64 = btoa(`${url}${JSON.stringify(data)}`);

	if (requestsLog[key64]) {
		const request = requestsLog[key64];
		const diff = moment().diff(request.timestamp);

		if (request.pending || (!request.pending && diff < 500)) {
			return;
		}
	}

	requestsLog[key64] = {
		pending: true,
		timestamp: moment()
	};

	const opts = {
		method: "POST",
		body: data
	};

	if (stringify) {
		opts.headers = {
			"Content-Type": "application/json"
		}
		opts.body = JSON.stringify(data);
	}

	const response = await fetch(url, opts);

	requestsLog[key64].pending = false;
	const { status } = response;
	const result = await response.json();
	if (status == 200 && result.success) {
		return result.data;
	} else {
		throw new Error(result.error || "An unknown error occurred.");
	}
}

export const convertObjectToQuery = input => Object.keys(input).reduce((out, key) => (out === ''
	? `?${key}=${input[key]}`
	: `${out}&${key}=${input[key]}`), '');

export const requireAll = r => ({
    ...r.keys().reduce((obj, key) => {
        return {
            ...obj,
            [key.replace(/(^.*\/|\..*$)/g, '')]: r(key)
        }
    }, {})
});

export const waitForTrue = (check, interval, attempts, callback) => {
	const loop = (count) => {
		if (check()) {
			callback();
		} else {
			setTimeout(() => loop(count + 1), interval);
		}
	}

	loop(0);
}

export const removeDuplicates = (entries, key = "id") => Object.values(reduce(entries, (obj, entry) => ({
	...obj,
	[entry[key]]: entry
}), {}));

export const request = process.env.VUE_ENV === 'server' ? coreRequest : apiRequest;

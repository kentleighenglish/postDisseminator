import { get } from "lodash";

import * as endpoints from "./endpoints";

const getEndpoint = url => {
	const path = url.replace(/^\//, "").replace("/", ".");

	return get(endpoints, path, null);
}

const sendOutput = (request, response) => (data = null, error = null, success = true) => {
	response.setHeader("Content-Type", "application/json");

	response.end(JSON.stringify({
		data,
		error,
		success
	}));
}

export default async (request, response, next) => {
	response.send = sendOutput(request, response);

	try {
		// throw new Error("test");
		const { url } = request;

		const endpointFunc = getEndpoint(url);

		if (endpointFunc) {
			const result = await endpointFunc(request, response, next);

			response.send(result);
		} else {
			throw `Endpoint not found ${request.url}`
		}
	} catch(e) {
		console.error(e);
		response.send(null, e.message, false);
	}
}

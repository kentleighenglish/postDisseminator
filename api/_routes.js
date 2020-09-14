
module.exports = {
	"post /auth/login": {
		action: "auth@login",
		params: {
			username: "string",
			password: "string"
		}
	}
}

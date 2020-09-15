
const clientConfig = {
	test: process.env.TEST
}

export default {
	components: true,
	globalName: "paperboy",
	head: {
		titleTemplate: title => `${title && title + ' - '} Paperboy`,
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },

		]
	},
	router: {
		middleware: [
			"auth",
		],
		linkActiveClass: "active",
		linkExactActiveClass: "active-exact"
	},
	pageTransition: "pageTransition",
	layoutTransition: "layoutTransition",
	srcDir: "src/",
	modules: [
		"@nuxtjs/auth",
		"@nuxtjs/axios",
		"@nuxtjs/style-resources",
		"portal-vue/nuxt"
	],
	middleware: ["auth"],
	serverMiddleware: [
		{ path: "/api", handler: "@@/api/body-parse.js" },
		{ path: "/api", handler: "@@/api/index.js" }
	],
	transpile: [ "@nuxtjs/auth" ],
	auth: {
		redirect: {
			logout: "/login"
		},
		strategies: {
			local: {
				endpoints: {
					login: { url: "/api/auth/login", method: "post", propertyName: "data.token" },
					logout: { url: "/api/auth/logout", method: "post" },
					user: { url: "/api/auth/user", method: "post", propertyName: "data.user" }
				}
			}
		}
	},
	styleResources: {
		scss: [
			"./scss/_global.scss"
		]
	},
	css: [
		"./scss/bootstrap.scss"
	],
	publicRuntimeConfig: clientConfig,
	privateRuntimeConfig: {
		rethink: {
			port: 8080
		}
	}
}

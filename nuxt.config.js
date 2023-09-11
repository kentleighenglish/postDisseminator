import path from "path";

const {
	TWITTER_KEY,
	TWITTER_SECRET,
	SITE_HOST
} = process.env;

const clientConfig = {
	internal: {
		host: SITE_HOST
	}
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
		{ path: "/api", handler: "@/api/body-parse.js" },
		{ path: "/api", handler: "@/api/index.js" }
	],
	plugins: [
		"~/plugins/platforms.client.js",
		"~/plugins/platforms.server.js",
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
	privateRuntimeConfig: {}
}


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
		{ path: "/api", handler: "@@/api/index.js" }
	],
	auth: {
		redirect: {
			logout: "/login"
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

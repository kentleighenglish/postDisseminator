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
	build: {
		extend(config, { isClient }) {
			if (!isClient && config.module && config.module.rules) {
				config.module.rules = config.module.rules.map(rule => {
					if (rule.test && rule.test.toString().indexOf("js") !== -1) {
						rule.use.push("webpack-conditional-loader");
					}

					return rule;
				});
			}
		}
	},
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
	privateRuntimeConfig: {}
}

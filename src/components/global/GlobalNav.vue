<template>
	<div class="topNav">
		<nav class="topNav__main">
			<ul>
				<li v-for="item in mainItems">
					<NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
				</li>
			</ul>
		</nav>
		<nav class="topNav__user">
			<ul class="userNav">
				<li v-for="item in userItems">
					<NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script>

export default {
	data: () => ({
		items: {
			main: [
				{ path: "/", label: "Dashboard", requiresAuth: true },
				{ path: "/link", label: "Link Accounts", requiresAuth: true }
			],
			user: [
				{ path: "/login", label: "Login", requiresAuth: false },
				{ path: "/logout", label: "Logout", requiresAuth: true }
			]
		}
	}),
	computed: {
		mainItems() {
			return this.parseItems(this.items.main);
		},
		userItems() {
			return this.parseItems(this.items.user);
		}
	},
	methods: {
		parseItems(items) {
			return items.reduce((acc, item) => {
				const { loggedIn } = this.$auth;

				if ((item.requiresAuth === true && loggedIn) || (item.requiresAuth === false && !loggedIn)) {
					acc.push(item);
				}

				return acc;
			}, []);
		}
	}
}

</script>
<style lang="scss">

	.topNav {
		display: flex;
		background: darken($bg, 5%);
		justify-content: space-between;

		nav {
			ul {
				display: flex;
				list-style: none;
				margin: 0;
				padding: 0;
			}

			li {
				display: block;
			}

			a {
				display: inline-block;
				padding: ($gap / 2) $gap;
				text-decoration: none;
				color: $primary;

				transition: background .1s;

				&.active-exact {
					border-bottom: 1px solid $primary;
				}

				&:hover {
					background: $primary-light;
					border-color: $primary-light;
					color: white;
				}
			}
		}
	}

</style>

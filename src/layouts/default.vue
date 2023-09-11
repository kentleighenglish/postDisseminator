<template>
	<div class="layout layout--default">
		<GlobalNav />
		<div class="content">
			<Nuxt />
		</div>
		<portal-target v-show="visibleModal" name="modal" class="modalContainer"></portal-target>
	</div>
</template>
<script>
	import { mapState } from "vuex";

	export default {
		computed: mapState({
			visibleModal: state => {
				return !!state.visibleModal
			}
		})
	}
</script>

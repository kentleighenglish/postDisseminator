
// const populateStore = ({ '$options': { populateStore } }) => populateStore();

export default {
	serverPrefetch() {
		const { populateStore } = this.$options;
		return new Promise(function(resolve, reject) {
			populateStore(this).then(resolve, reject);
		}.bind(this));
	},
	mounted() {
		const { populateStore } = this.$options;
		if (!this.hasPrefetched) {
			populateStore(this);
		}
	},
	watch: {
		hasPrefetched(prefetched) {
			const { populateStore } = this.$options;
			if (!prefetched) {
				populateStore(this);
			}
		}
	}
}

import Vue from "vue";
import createLogger from 'vuex/dist/logger'
import debugFunc from "debug";

export const MUTATION_TYPES = {
	OPEN_MODAL: "OPEN_MODAL",
	CLOSE_MODAL: "CLOSE_MODAL",
	ADD_ALERT: "ADD_ALERT",
	REMOVE_ALERT: "REMOVE_ALERT",
	CLEAR_ALERTS: "CLEAR_ALERTS"
}

const middleware = [];

const loggingMiddleware = store => {
	store.subscribe((mutation, state) => {
		const debug = debugFunc('app:store');
		debug('Store mutation', mutation.type);
	});
}

if (process.env.NODE_ENV === 'development') {
	if (process.env.VUE_ENV === 'server') {
		middleware.push(loggingMiddleware);
	} else {
		middleware.push(createLogger());
	}
}


export const plugins = middleware;

export const state = () => ({
	visibleModal: null,
	alerts: {}
})

export const actions = {
	openModal: ({ commit, state }, modal) => {
		commit(MUTATION_TYPES.OPEN_MODAL, { modal });
	},
	closeModal: ({ commit, state }, modal) => {
		commit(MUTATION_TYPES.CLOSE_MODAL);
	},
	addAlert: ({ commit }, { group = 'global', ...alert }) => {
		commit(MUTATION_TYPES.CLEAR_ALERTS, { group });

		const timestamp = String(new Date().valueOf());
		if (typeof btoa === 'function') {
			const id = btoa(`${timestamp}:${alert.message}`);
			commit(MUTATION_TYPES.ADD_ALERT, { group, alert: { id, timestamp, ...alert } })
		} else {
			const id = Buffer.from(`${timestamp}:${alert.message}`).toString('base64');
			commit(MUTATION_TYPES.ADD_ALERT, { group, alert: { id, timestamp, ...alert } })
			console.error(alert);
		}
	},
	removeAlert: ({ commit }, { group, id }) => {
		commit(MUTATION_TYPES.REMOVE_ALERT, { group, id });
	},
	clearAlerts: ({ commit }, group) => {
		commit(MUTATION_TYPES.CLEAR_ALERTS, { group });
	}
}

export const mutations = {
	[MUTATION_TYPES.OPEN_MODAL]: function(state, { modal }) {
		state.visibleModal = modal;
	},
	[MUTATION_TYPES.CLOSE_MODAL]: function(state) {
		state.visibleModal = null;
	},
	[MUTATION_TYPES.ADD_ALERT]: function(state, { group, alert }) {
		if (state.alerts[group]) {
			Vue.set(state.alerts, group, [ ...state.alerts[group], alert ]);
		} else {
			Vue.set(state.alerts, group, [ alert ]);
		}
	},
	[MUTATION_TYPES.REMOVE_ALERT]: function(state, { group, id }) {
		if (state.alerts[group]) {
			Vue.set(state.alerts, group, state.alerts[group].reduce((arr, alert) => (alert.id === id ? arr : [ ...arr, alert ]), []));
		}
	},
	[MUTATION_TYPES.CLEAR_ALERTS]: function(state, { group }) {
		Vue.set(state.alerts, group, []);
	}
}

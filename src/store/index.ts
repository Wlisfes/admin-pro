import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import * as modules from './modules'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules,
	plugins: [
		createPersistedState({
			storage: window.sessionStorage
		})
	]
})

export function useStore(): Store<any> {
	return store
}

export default store

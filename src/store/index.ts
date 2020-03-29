import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import * as modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules
})

export function useStore(): Store<any> {
	return store
}

export default store

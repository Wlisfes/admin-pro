/*
 * @Date: 2020-03-27 17:18:44
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 17:19:58
 * @Description: 
 */
import { Module, MutationTree, ActionTree } from 'vuex'




const createState = (): AppState => ({
	
})

const mutations: MutationTree<AppState> = {
	
}

const actions: ActionTree<AppState, any> = {
	
}

const app: Module<AppState, any> = {
	namespaced: true,
	state: createState(),
	mutations,
	actions
}

export default app

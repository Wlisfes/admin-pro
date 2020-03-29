/*
 * @Date: 2020-03-27 17:18:44
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 17:19:58
 * @Description:
 */
import { Module, MutationTree, ActionTree } from 'vuex'
import { AppState } from './types'

const createState = (): AppState => ({
	user: null,
	device: 'desktop', //视口
	collapsed: false, //菜单是否收起
	openKeys: ['home'], //初始展开的 SubMenu 菜单项 key 数组
	selectedKeys: ['home-index'], //初始选中的 Item 菜单项 key 数组
	siderfixed: true, //是否固定侧边栏
	headerfixed: false //是否固定头部
})

const mutations: MutationTree<AppState> = {
	SET_USER: (state, user) => {
		state.user = user
	},
	SET_DEVICE: (state, device) => {
		state.device = device
	},
	SET_COLLAPSED: (state, collapsed) => {
		state.collapsed = collapsed
	},
	SET_OPENKEYS: (state, openKeys) => {
		state.openKeys = openKeys
	},
	SET_SELECTEKEYS: (state, selectedKeys) => {
		state.selectedKeys = selectedKeys
	},
	SET_SIDERFIXED: (state, siderfixed) => {
		state.siderfixed = siderfixed
	},
	SET_HEADERFIXED: (state, headerfixed) => {
		state.headerfixed = headerfixed
	}
}

const actions: ActionTree<AppState, any> = {}

const app: Module<AppState, any> = {
	namespaced: true,
	state: createState(),
	mutations,
	actions
}

export default app

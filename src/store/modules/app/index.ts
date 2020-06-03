/*
 * @Date: 2020-03-27 17:18:44
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-03 17:11:42
 * @Description:
 */
import Vue from 'vue'
import { Module, MutationTree, ActionTree } from 'vuex'
import { AppState } from './types'
import { login } from '@/api/user'
import { Modal } from 'ant-design-vue'
import router from '@/router'

const createState = (): AppState => ({
	user: null, //用户信息
	device: 'desktop', //视口
	collapsed: false, //菜单是否收起
	theme: 'light', //菜单风格
	primaryColor: '#1890FF', //主题颜色
	multiple: false, //是否显示多页标签
	openKeys: ['home'], //初始展开的 SubMenu 菜单项 key 数组
	selectedKeys: ['home-index'], //初始选中的 Item 菜单项 key 数组
	siderfixed: false, //是否固定侧边栏
	headerfixed: false, //是否固定头部
	noneheader: false //下滑是否隐藏头部
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
	SET_THEME: (state, theme) => {
		state.theme = theme
		Vue.ls.set('theme', theme)
	},
	SET_PRIMARYCOLOR: (state, primaryColor) => {
		state.primaryColor = primaryColor
	},
	SET_MULTIPLE: (state, multiple) => {
		state.multiple = multiple
	},
	SET_OPENKEYS: (state, openKeys) => {
		state.openKeys = openKeys
	},
	SET_SELECTEKEYS: (state, selectedKeys) => {
		state.selectedKeys = selectedKeys
	},
	SET_SIDERFIXED: (state, siderfixed) => {
		state.siderfixed = siderfixed
		Vue.ls.set('siderfixed', siderfixed)
	},
	SET_HEADERFIXED: (state, headerfixed) => {
		state.headerfixed = headerfixed
		Vue.ls.set('headerfixed', headerfixed)
	},
	SET_NONEHEADER: (state, noneheader) => {
		state.noneheader = noneheader
		Vue.ls.set('noneheader', noneheader)
	}
}

const actions: ActionTree<AppState, any> = {
	login: async ({ commit }, form: { username: string; password: string }) => {
		const response = await login({
			username: form.username,
			password: form.password
		})

		if (response.code === 200) {
			commit('SET_USER', response.data)
			Vue.ls.set('user', response.data, 6 * 3600 * 1000)
		}
		return response.code === 200
	},
	logout: ({ commit }) => {
		return new Promise(resolve => {
			Modal.confirm({
				title: 'Message',
				content: '确定要退出吗？',
				onOk: () => {
					return new Promise(response => {
						setTimeout(() => {
							commit('SET_USER', null)
							Vue.ls.remove('user')
							response()
							resolve(true)
							router.replace('/login')
						}, 1000)
					})
				},
				onCancel: () => resolve(false)
			})
		})
	}
}

const app: Module<AppState, any> = {
	namespaced: true,
	state: createState(),
	mutations,
	actions
}

export default app

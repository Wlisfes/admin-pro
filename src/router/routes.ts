/*
 * @Date: 2020-03-31 15:16:00
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-31 15:19:14
 * @Description: page配置
 */

import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout'

const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'Layout',
		redirect: '/home',
		component: Layout,
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home')
			},

			/**管理员/权限******************************************************/
			{
				path: '/admin-user',
				name: 'admin-user',
				component: () => import('@/views/user/User')
			},
			{
				path: '/admin-role',
				name: 'admin-role',
				component: () => import('@/views/user/Role')
			},
			{
				path: '/admin-apply',
				name: 'admin-apply',
				component: () => import('@/views/user/Apply')
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login')
	}
]

export default routes

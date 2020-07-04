/*
 * @Date: 2020-03-31 15:16:00
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-30 12:24:04
 * @Description: page配置
 */

import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout'
import Main from '@/views/login/Main'

const routes: RouteConfig[] = [
	{
		path: '/main',
		name: 'main',
		redirect: '/main/logio',
		component: Main,
		children: [
			{
				path: '/main/login',
				name: 'login',
				component: () => import('@/views/login/Login')
			},
			{
				path: '/main/register',
				name: 'register',
				component: () => import('@/views/login/Register')
			}
		]
	},
	{
		path: '/',
		name: 'Layout',
		redirect: '/home',
		component: Layout,
		children: [
			{
				path: '/home',
				name: 'home',
				meta: { title: '首页' },
				component: () => import('@/views/home')
			},
			/**管理员/权限******************************************************/
			{
				path: '/admin/user',
				name: 'admin-user',
				meta: { title: '用户管理' },
				component: () => import('@/views/user/User')
			},
			{
				path: '/admin/role',
				name: 'admin-role',
				meta: { title: '角色管理' },
				component: () => import('@/views/user/Role')
			},
			{
				path: '/admin/auth',
				name: 'admin-auth',
				meta: { title: '权限管理' },
				component: () => import('@/views/user/Auth')
			},
			/**标签管理******************************************************/
			{
				path: '/label/list',
				name: 'label-list',
				meta: { title: '标签列表' },
				component: () => import('@/views/tag/TAGAll')
			},
			/**项目管理******************************************************/
			{
				path: '/project/list',
				name: 'project-list',
				meta: { title: '项目列表' },
				component: () => import('@/views/project/Project')
			},
			/**文章管理******************************************************/
			{
				path: '/article/list',
				name: 'article-list',
				meta: { title: '文章列表' },
				component: () => import('@/views/article/Article')
			},
			{
				path: '/article/create',
				name: 'article-create',
				meta: { title: '新增文章' },
				component: () => import('@/views/article/CreateArticle')
			},
			/**笔记管理******************************************************/
			{
				path: '/notes/list',
				name: 'notes-list',
				meta: { title: '笔记列表' },
				component: () => import('@/views/notes/Notes')
			},
			{
				path: '/notes/create',
				name: 'notes-create',
				meta: { title: '新增笔记' },
				component: () => import('@/views/notes/CreateNotes')
			},
			/**设置中心******************************************************/
			{
				path: '/user/center',
				name: 'user-center',
				meta: { title: '个人中心' },
				component: () => import('@/views/center/UserCenter')
			},
			{
				path: '/user/setting',
				name: 'user-setting',
				meta: { title: '个人设置' },
				component: () => import('@/views/center/UserSetting')
			}
		]
	}
]

export default routes

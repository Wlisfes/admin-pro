/*
 * @Date: 2020-03-31 15:16:00
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 17:08:16
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
				meta: { title: '首页' },
				component: () => import('@/views/home')
			},

			/**管理员/权限******************************************************/
			{
				path: '/admin-user',
				name: 'admin-user',
				meta: { title: '用户管理' },
				component: () => import('@/views/user/User')
			},
			{
				path: '/admin-role',
				name: 'admin-role',
				meta: { title: '角色管理' },
				component: () => import('@/views/user/Role')
			},
			{
				path: '/admin-auth',
				name: 'admin-auth',
				meta: { title: '权限管理' },
				component: () => import('@/views/user/Auth')
			},
			/**标签管理******************************************************/
			{
				path: '/tag-all',
				name: 'tag-all',
				meta: { title: '标签列表' },
				component: () => import('@/views/tag/TAGAll')
			},
			/**项目管理******************************************************/
			{
				path: '/project-all',
				name: 'project-all',
				meta: { title: '项目列表' },
				component: () => import('@/views/project/Project')
			},
			/**文章管理******************************************************/
			{
				path: '/create-article',
				name: 'create-article',
				meta: { title: '新增文章' },
				component: () => import('@/views/article/CreateArticle')
			},
			{
				path: '/article-all',
				name: 'article-all',
				meta: { title: '文章列表' },
				component: () => import('@/views/article/ArticleAll')
			},
			/**笔记管理******************************************************/
			{
				path: '/create-notes',
				name: 'create-notes',
				meta: { title: '新增笔记' },
				component: () => import('@/views/notes/CreateNotes')
			},
			{
				path: '/notes-all',
				name: 'notes-all',
				meta: { title: '笔记列表' },
				component: () => import('@/views/notes/NotesAll')
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

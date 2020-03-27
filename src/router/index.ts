import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/home'
import Layout from '@/components/layout'

Vue.use(VueRouter)

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
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router

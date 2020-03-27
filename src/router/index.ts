import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/home'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'Login',
		component: () => import('@/views/login')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router

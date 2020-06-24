import Vue from 'vue'
import router from '@/router'
import { resetStore } from '@/utils/bootstrap'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList: string[] = ['login', 'register'] //白名单页面

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	const user = Vue.ls.get('user')
	if (user) {
		if (whiteList.includes(to.name as string)) {
			next({ path: '/', replace: true })
			NProgress.done()
		} else {
			next()
		}
	} else {
		resetStore()
		if (whiteList.includes(to.name as string)) {
			next()
		} else {
			next({ path: '/login', replace: true })
			NProgress.done()
		}
	}
})

router.afterEach((to, form) => {
	// console.log(to, form)
	NProgress.done()
})

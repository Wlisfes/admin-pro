import Vue from 'vue'
import router from '@/router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList: string[] = ['login', 'register']

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
		if (whiteList.includes(to.name as string)) {
			//白名单页面
			next()
		} else {
			next({ path: '/login', replace: true })
			NProgress.done()
		}
	}
})

router.afterEach(() => {
	NProgress.done()
})

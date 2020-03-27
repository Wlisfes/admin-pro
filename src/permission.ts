import Vue from 'vue'
import router from '@/router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach(async (to, from, next) => {
	NProgress.start()

	next()
})

router.afterEach(() => {
	NProgress.done()
})

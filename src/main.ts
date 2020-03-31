import { message, notification } from 'ant-design-vue'

import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import Storage from 'vue-ls'

import bootstrap from '@/utils/bootstrap'
import '@/permission'

Vue.config.productionTip = false
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.use(Storage, {
	namespace: 'admin__pro__',
	name: 'ls',
	storage: 'local'
})

new Vue({
	router,
	store,
	created: bootstrap,
	render: h => h(App)
}).$mount('#app')

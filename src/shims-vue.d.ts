import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}

declare module 'vue/types/vue' {
	interface Vue {
		$router: VueRouter
		$route: Route
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		[propsName: string]: any
		ref?: string
	}
}

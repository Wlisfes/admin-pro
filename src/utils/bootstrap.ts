import Vue from 'vue'
import { useStore } from '@/store'

export default function bootstrap() {
	const store = useStore()
	store.commit('app/SET_USER', Vue.ls.get('access_token'))
	store.commit('app/SET_THEME', Vue.ls.get('theme') || 'light')
	store.commit('app/SET_MULTIPLE', Vue.ls.get('multiple') || false)
	store.commit('app/SET_SIDERFIXED', Vue.ls.get('siderfixed') || false)
	store.commit('app/SET_HEADERFIXED', Vue.ls.get('headerfixed') || false)
	store.commit('app/SET_NONEHEADER', Vue.ls.get('noneheader') || false)
}

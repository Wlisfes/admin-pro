import Vue from 'vue'
import { useStore } from '@/store'

export default function bootstrap() {
	const store = useStore()
	store.commit('app/SET_USER', Vue.ls.get('user'))
	store.commit('app/SET_THEME', Vue.ls.get('theme') || 'light')
	store.commit('app/SET_PRIMARYCOLOR', Vue.ls.get('primaryColor') || '#1890FF')
	store.commit('app/SET_MULTIPLE', Vue.ls.get('multiple') || false)
	store.commit('app/SET_SIDERFIXED', Vue.ls.get('siderfixed') || false)
	store.commit('app/SET_HEADERFIXED', Vue.ls.get('headerfixed') || false)
	store.commit('app/SET_NONEHEADER', Vue.ls.get('noneheader') || false)
}

export function resetStore() {
	const store = useStore()
	Vue.ls.remove('user')
	store.commit('app/SET_USER', null)
	store.commit('app/SET_DEVICE', 'desktop')
	store.commit('app/SET_COLLAPSED', false)
	store.commit('app/SET_MULTIPLE', false)
	store.commit('app/SET_OPENKEYS', ['home'])
	store.commit('app/SET_SELECTEKEYS', ['home-index'])
}

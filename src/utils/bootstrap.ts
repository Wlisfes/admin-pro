import Vue from 'vue'
import { useStore } from '@/store'

export default function bootstrap() {
	const store = useStore()
	store.commit('app/SET_USER', Vue.ls.get('access_token'))

	console.log('start created')
}

import Vue from 'vue'
import { notification } from 'ant-design-vue'
import { resetStore } from '@/utils/bootstrap'
import router from '@/router'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const service: AxiosInstance = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL,
	timeout: 30000
})

//错误拦截处理
const err = (error: AxiosError<any>) => {
	if (error.response) {
		const data = error.response.data
		if (error.response.status === 400) {
			notification.error({
				message: '管道拦截',
				description: data.message
			})
		} else if (error.response.status === 401) {
			notification.error({
				message: '守卫拦截',
				description: data.message
			})
			Vue.ls.remove('user')
			resetStore()
			router.replace('/login')
		} else if (error.response.status === 403) {
			//权限不足、账号被禁用、密码更换
			notification.error({
				message: '账号异常',
				description: data.message
			})
			// Vue.ls.remove('user')
			// resetStore()
			// router.replace('/login')
		} else {
			notification.error({
				message: '服务器开了小个差',
				description: data.message
			})
		}
		return Promise.resolve(data)
	}
	return Promise.resolve(error)
}

//请求拦截
service.interceptors.request.use((config: AxiosRequestConfig) => {
	const user = Vue.ls.get('user')
	if (user) {
		config.headers['access-token'] = user.access_token
	}
	return config
}, err)

//响应拦截
service.interceptors.response.use((response: AxiosResponse) => {
	return response.data
}, err)

export default service

import Vue from 'vue'
import { notification } from 'ant-design-vue'
import router from '@/router'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface Response<T = any> extends AxiosResponse {
	data: T
	timestamp: string
	message: string
	code: number
	url?: string
	method?: string
	[key: string]: any
}

const service: AxiosInstance = axios.create({
	baseURL: `/api`,
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
		} else if (error.response.status === 401 || error.response.status === 403) {
			notification.error({
				message: '守卫拦截',
				description: data.message
			})
			if (!Vue.ls.get('user')) {
				//未登录
			}
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
	return config
}, err)

//响应拦截
service.interceptors.response.use((response: AxiosResponse) => {
	return response.data
}, err)

export default service

/*
 * @Date: 2020-04-07 17:05:58
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-07 17:22:30
 * @Description: axios重写声明文件
 */

export interface Response<T = any> {
	data: T
	timestamp: string
	message: string
	code: number
	url?: string
	method?: string
	[key: string]: any
}

declare module 'axios' {
	export interface AxiosInstance {
		<T = Response>(config: AxiosRequestConfig): Promise<T>
	}
}

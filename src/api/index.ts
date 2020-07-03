/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 21:20:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-02 18:04:42
 * @Description: 全局api接口
 */

import http from '@/utils/request'
import { UserType } from '@/api/user'

//单张图片上传、头像上传
export const uploadFile = (params: FormData) => {
	return http({
		url: '/oss/upload/file',
		method: 'POST',
		data: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

//单张图片上传、静态图片资源
export const upload = (params: FormData) => {
	return http({
		url: '/oss/upload/file/pic',
		method: 'POST',
		data: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

//多张图片上传、静态图片资源
export const uploadFiles = (params: FormData) => {
	return http({
		url: '/oss/upload/files',
		method: 'POST',
		data: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

//信息统计
export const AppCount = () => {
	return http({
		url: '/v2/app/count',
		method: 'GET'
	})
}

//动态日志
export interface AppLoggerType {
	id: number
	ipv4: string
	content: string
	context: string
	createTime: string
	user: UserType
}
export const AppLogger = (params?: { limit: number; offset: number }) => {
	return http<{ len: number; logger: AppLoggerType[] }>({
		url: '/v2/logger/all',
		method: 'GET',
		params
	})
}

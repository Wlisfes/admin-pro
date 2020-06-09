/*
 * @Date: 2020-04-23 14:10:39
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-09 12:54:27
 * @Description: 权限模块接口
 */

import http from '@/utils/request'

interface Apply {
	key: string
	name: string
	status: number
}
interface Auth {
	auth_key: string
	auth_name: string
	status: number
	apply: Apply[]
}
export interface ApplyType extends Apply {}
export interface AuthType extends Auth {
	id: number
	createTime: string
	all: number
}

//获取所有权限模块列表
export const authAll = () => {
	return http<Array<AuthType>>({
		url: `/v2/auth/all`,
		method: 'GET'
	})
}

//新增权限模块
export const createAuth = (params: Auth) => {
	return http<AuthType>({
		url: `/v2/auth/create`,
		method: 'POST',
		data: params
	})
}

//修改权限模块
export const updateAuth = (params: { id: number; auth_name: string; status: number; apply: Apply[] }) => {
	return http<AuthType>({
		url: `/v2/auth/update`,
		method: 'PUT',
		data: params
	})
}

//删除权限模块
export const deleteAuth = (params: { id: number }) => {
	return http({
		url: `/v2/auth/delete`,
		method: 'DELETE',
		params
	})
}

//切换权限模块状态
export const cutoverAuth = (params: { id: number }) => {
	return http<AuthType>({
		url: `/v2/auth/cutover`,
		method: 'PUT',
		params
	})
}

//获取权限模块信息
export const getAuth = (params: { id: number }) => {
	return http<AuthType>({
		url: `/v2/auth/info`,
		method: 'GET',
		params
	})
}

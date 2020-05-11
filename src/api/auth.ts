/*
 * @Date: 2020-04-23 14:10:39
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:42:50
 * @Description: 权限模块接口
 */

import http from '@/utils/request'

export interface Apply {
	status: number
	apply_key: string
	apply_name: string
}
export interface AuthInter {
	id: string
	auth_key: string
	auth_name: string
	apply: Array<Apply>
	all: boolean
	status: number
	[key: string]: any
}
export interface IsAuthInter {
	id?: string
	auth_key?: string
	auth_name?: string
	apply?: Array<Apply>
	all?: boolean
	status?: number
	key?: string
	[key: string]: any
}

//获取所有权限模块列表
export const authAll = (params?: IsAuthInter) => {
	return http({
		url: `/api/auth/all`,
		method: 'GET',
		params
	})
}

//新增权限模块
export const createAuth = (params: IsAuthInter) => {
	return http({
		url: `/api/auth/create`,
		method: 'POST',
		data: params
	})
}

//修改权限模块
export const updateAuth = (params: IsAuthInter) => {
	return http({
		url: `/api/auth/update`,
		method: 'PUT',
		data: params
	})
}

//删除权限模块
export const deleteAuth = (params: { id: string }) => {
	return http({
		url: `/api/auth/delete`,
		method: 'DELETE',
		params
	})
}

//切换权限模块状态
export const changeAuth = (params: { id: string; status: number }) => {
	return http({
		url: `/api/auth/change`,
		method: 'PUT',
		data: params
	})
}

//获取权限模块信息
export const roleInfo = (params: { id: string }) => {
	return http({
		url: `/api/auth/info`,
		method: 'GET',
		params
	})
}

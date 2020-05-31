/*
 * @Date: 2020-04-23 14:10:39
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:42:50
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

//获取所有权限模块列表
export const authAll = () => {
	return http({
		url: `/api/auth/all`,
		method: 'GET'
	})
}

//新增权限模块
export const createAuth = (params: Auth) => {
	return http({
		url: `/api/auth/create`,
		method: 'POST',
		data: params
	})
}

//修改权限模块
export const updateAuth = (params: any) => {
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

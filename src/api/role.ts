/*
 * @Author: 情雨随风
 * @Date: 2020-04-24 23:50:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-25 21:34:56
 * @Description: 角色模块接口
 */

import http from '@/utils/request'

export interface ApplyInter {
	apply_key: string
	apply_name: string
	status: number
}
export interface AuthInter {
	auth_key: string
	auth_name: string
	apply: Array<ApplyInter>
}
export interface RoleInter {
	id: string
	role_uid: string
	role_key: string
	role_name: string
	status: number
	auth: Array<AuthInter>
	[key: string]: any
}
export interface IsRoleInter {
	id?: string
	key?: string
	role_uid?: string
	role_key?: string
	role_name?: string
	status?: number
	auth?: Array<AuthInter>
	[key: string]: any
}

//获取所有角色列表
export const roleAll = (params?: IsRoleInter) => {
	return http({
		url: `/api/role/all`,
		method: 'GET',
		params
	})
}

//新增角色
export const createRole = (params: IsRoleInter) => {
	return http({
		url: `/api/role/create`,
		method: 'POST',
		data: params
	})
}

//修改角色
export const updateRole = (params: IsRoleInter) => {
	return http({
		url: `/api/role/update`,
		method: 'PUT',
		data: params
	})
}

//切换角色状态
export const changeRole = (params: { id: string; status: number }) => {
	return http({
		url: `/api/role/change`,
		method: 'PUT',
		data: params
	})
}

//删除权限模块
export const deleteRole = (params: { id: string }) => {
	return http({
		url: `/api/role/delete`,
		method: 'DELETE',
		params
	})
}

//获取角色信息
export const roleInfo = (params: { id: string }) => {
	return http({
		url: `/api/role/info`,
		method: 'GET',
		params
	})
}

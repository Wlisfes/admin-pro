/*
 * @Author: 情雨随风
 * @Date: 2020-04-24 23:50:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 22:27:36
 * @Description: 角色模块接口
 */

import http from '@/utils/request'

export interface RoleType {
	id: number
	role_key: string
	role_name: string
	status: number
	createTime: string
}

//获取所有角色列表
export const roleAll = () => {
	return http<Array<RoleType>>({
		url: `/api/role/all`,
		method: 'GET'
	})
}

//新增角色
export const createRole = (params: { role_key: string; role_name: string; status: number }) => {
	return http<RoleType>({
		url: `/api/role/create`,
		method: 'POST',
		data: params
	})
}

//修改角色
export const updateRole = (params: { id: number; role_key: string; role_name: string; status: number }) => {
	return http<RoleType>({
		url: `/api/role/update`,
		method: 'PUT',
		data: params
	})
}

//切换角色状态
export const cutoverRole = (params: { id: number }) => {
	return http({
		url: `/api/role/cutover`,
		method: 'PUT',
		params
	})
}

//删除权限模块
export const deleteRole = (params: { id: number }) => {
	return http({
		url: `/api/role/delete`,
		method: 'DELETE',
		params
	})
}

//获取角色信息
export const getRole = (params: { id: number }) => {
	return http<RoleType>({
		url: `/api/role/info`,
		method: 'GET',
		params
	})
}

/*
 * @Date: 2020-04-23 14:10:39
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-23 15:57:09
 * @Description: 权限模块接口
 */

import http from '@/utils/request'

//获取所有权限模块列表
export const authAll = (params?: any) => {
	return http({
		url: `/api/auth/all`,
		method: 'GET',
		params
	})
}

//新增权限模块
export const createAuth = (params: any) => {
	return http({
		url: `/api/auth/create`,
		method: 'POST',
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

//
export const changeAuth = (params: { id: string; status: number }) => {
	return http({
		url: `/api/auth/change`,
		method: 'PUT',
		data: params
	})
}

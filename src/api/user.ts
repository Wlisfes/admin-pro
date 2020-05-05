/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 22:33:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-05 18:01:00
 * @Description: 用户模块接口
 */

import http from '@/utils/request'
import { ApplyType } from '@/interface/user'

//登录
export const login = (params: { username: string; password: string }) => {
	return http({
		url: `/api/user/login`,
		method: 'POST',
		data: params
	})
}

//获取所有用户列表
export const allUser = (params?: any) => {
	return http({
		url: `/api/user/all`,
		method: 'GET',
		params
	})
}

//切换权限模块状态
export const changeUser = (params: { id: string; status: number }) => {
	return http({
		url: `/api/user/change`,
		method: 'PUT',
		data: params
	})
}

//修改用户信息
export const updateUser = (params: {
	id: string
	nickname?: string
	avatar?: string
	mobile?: number
	email?: string
}) => {
	return http({
		url: `/api/user/update`,
		method: 'PUT',
		data: params
	})
}

//删除用户
export const deleteUser = (params: { id: string }) => {
	return http({
		url: `/api/user/delete`,
		method: 'DELETE',
		params
	})
}

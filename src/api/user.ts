/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 22:33:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 14:43:17
 * @Description: 用户模块接口
 */

import http from '@/utils/request'

//登录
export const login = (params: { username?: string; email?: string; mobile?: string | number; password: string }) => {
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

//获取用户信息
export const getUser = (params: { uid: number }) => {
	return http({
		url: `/api/user/info`,
		method: 'GET',
		params
	})
}

//切换权限模块状态
export const cutoverUser = (params: { uid: number }) => {
	return http({
		url: `/api/user/cutover`,
		method: 'PUT',
		params
	})
}

//修改用户信息
export const updateUser = (params: {
	uid: number
	nickname: string
	status: number
	mobile?: number
	email?: string
}) => {
	return http({
		url: `/api/user/update`,
		method: 'PUT',
		data: params
	})
}

//修改用户权限
export const updateUserAuth = (params: any) => {
	return http({
		url: `/api/user/update/role`,
		method: 'PUT',
		data: params
	})
}

//修改用户头像
export const updateUserAvatar = (params: { uid: number; avatar: string }) => {
	return http({
		url: `/api/user/update/avatar`,
		method: 'PUT',
		data: params
	})
}

//删除用户
export const deleteUser = (params: { uid: number }) => {
	return http({
		url: `/api/user/delete`,
		method: 'DELETE',
		params
	})
}

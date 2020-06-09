/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 22:33:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 22:39:56
 * @Description: 用户模块接口
 */

import http from '@/utils/request'
import { RoleType } from '@/api/role'
import { AuthType } from '@/api/auth'

export interface UserType {
	id: number
	uid: number
	username: string
	nickname: string
	status: number
	createTime: string
	email: string | null
	mobile: string | null
	avatar: string | null
	access_token?: string
	article?: [] | null
	role?: RoleType | null
	auth?: AuthType[] | null
}

//登录
export const login = (params: { username?: string; email?: string; mobile?: string | number; password: string }) => {
	return http<UserType>({
		url: `/v2/user/login`,
		method: 'POST',
		data: params
	})
}

//获取所有用户列表
export const allUser = (params?: any) => {
	return http<Array<UserType>>({
		url: `/v2/user/all`,
		method: 'GET',
		params
	})
}

//获取用户信息
export const getUser = (params: { uid: number }) => {
	return http<UserType>({
		url: `/v2/user/info`,
		method: 'GET',
		params
	})
}

//切换权限模块状态
export const cutoverUser = (params: { uid: number }) => {
	return http<UserType>({
		url: `/v2/user/cutover`,
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
	return http<UserType>({
		url: `/v2/user/update`,
		method: 'PUT',
		data: params
	})
}

//修改用户权限
export const updateUserAuth = (params: any) => {
	return http<UserType>({
		url: `/v2/user/update/role`,
		method: 'PUT',
		data: params
	})
}

//修改用户头像
export const updateUserAvatar = (params: { uid: number; avatar: string }) => {
	return http<UserType>({
		url: `/v2/user/update/avatar`,
		method: 'PUT',
		data: params
	})
}

//删除用户
export const deleteUser = (params: { uid: number }) => {
	return http({
		url: `/v2/user/delete`,
		method: 'DELETE',
		params
	})
}

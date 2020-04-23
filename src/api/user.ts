/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 22:33:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 23:35:13
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

//修改用户信息
export const updateUser = (params: {
	id: string
	username?: string
	nick_name?: string
	disable?: boolean
	avatar?: string
	password?: string
}) => {
	return http({
		url: `/api/user/update`,
		method: 'PUT',
		data: params
	})
}

//删除用户
export const removeUser = (params: { id: string }) => {
	return http({
		url: `/api/user/remove`,
		method: 'DELETE',
		params
	})
}

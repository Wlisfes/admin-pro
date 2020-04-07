/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 22:33:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-07 22:42:51
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

//获取所有操作类型
export const applyAll = (params?: any) => {
	return http({
		url: `/api/permission/apply/all`,
		method: 'GET',
		params
	})
}

//创建权限模块
export const createPermission = (params: {
	permission_id: string
	permission_name: string
	description: string
	disable: boolean
	permission: ApplyType[]
}) => {
	return http({
		url: `/api/permission/create`,
		method: 'POST',
		data: params
	})
}

/*
 * @Author: 情雨随风
 * @Date: 2020-06-04 21:30:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-15 21:17:07
 * @Description: 标签模块接口
 */

import http from '@/utils/request'
import { UserType } from '@/api/user'

export interface TAGType {
	id: number
	name: string
	color: string
	status: number
	sort: number
	createTime: string
	updateTime: string
	user: UserType
}

//创建标签
export const createTAG = (params: { name: string; color: string; status: number }) => {
	return http<Array<TAGType>>({
		url: '/v2/tag/create',
		method: 'POST',
		data: params
	})
}

//获取所有标签
export const TAGAll = (params?: { uid?: number; status?: number; createTime?: string }) => {
	return http<Array<TAGType>>({
		url: '/v2/tag/all',
		method: 'GET',
		params
	})
}

//获取标签详情
export const getTAG = (params: { id: number }) => {
	return http<TAGType>({
		url: '/v2/tag/info',
		method: 'GET',
		params
	})
}

//修改标签
export const updateTAG = (params: { id: number; name: string; color: string; status: number }) => {
	return http<TAGType>({
		url: '/v2/tag/update',
		method: 'PUT',
		data: params
	})
}

//置顶标签
export const sortTAG = (params: { id: number }) => {
	return http<TAGType>({
		url: `/v2/tag/sort`,
		method: 'PUT',
		params
	})
}

//切换标签状态
export const cutoverTAG = (params: { id: number }) => {
	return http<TAGType>({
		url: `/v2/tag/cutover`,
		method: 'PUT',
		params
	})
}

//删除标签
export const deleteTAG = (params: { id: number }) => {
	return http({
		url: `/v2/tag/delete`,
		method: 'DELETE',
		params
	})
}

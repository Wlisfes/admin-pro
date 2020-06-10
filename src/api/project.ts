/*
 * @Date: 2020-06-09 14:24:01
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-10 17:15:33
 * @Description: 项目模块接口
 */

import http from '@/utils/request'
import { UserType } from '@/api/user'
import { TAGType } from '@/api/tag'

export interface ProjectType {
	id: number
	like: number
	status: number
	sort: number
	title: string
	description: string
	picUrl: string
	github: string
	accessUrl: string | null
	user: UserType
	tag: TAGType[]
}

//创建项目
export const createProject = (params: {
	title: string
	description: string
	picUrl: string
	github: string
	accessUrl?: string
	status?: number
	tag: number[]
}) => {
	return http<ProjectType>({
		url: `/v2/project/create`,
		method: 'POST',
		data: params
	})
}

//获取所有项目列表
export const projectAll = (params?: { uid?: number; status?: number; createTime?: string }) => {
	return http<Array<ProjectType>>({
		url: `/v2/project/all`,
		method: 'GET',
		params
	})
}

//获取项目详情
export const getProject = (params: { id: number }) => {
	return http<ProjectType>({
		url: `/v2/project/info`,
		method: 'GET',
		params
	})
}

//修改项目
export const updateProject = (params: {
	id: number
	title: string
	description: string
	picUrl: string
	github: string
	accessUrl?: string
	status?: number
	tag: number[]
}) => {
	return http<ProjectType>({
		url: `/v2/project/update`,
		method: 'PUT',
		data: params
	})
}

//置顶项目
export const sortProject = (params: { id: number }) => {
	return http<ProjectType>({
		url: `/v2/project/sort`,
		method: 'PUT',
		params
	})
}

//切换项目状态
export const cutoverProject = (params: { id: number }) => {
	return http<ProjectType>({
		url: `/v2/project/cutover`,
		method: 'PUT',
		params
	})
}

//删除项目
export const deleteProject = (params: { id: number }) => {
	return http({
		url: `/v2/project/delete`,
		method: 'DELETE',
		params
	})
}

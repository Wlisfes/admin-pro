/*
 * @Date: 2020-06-09 14:24:01
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-09 14:44:04
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

//获取所有项目列表
export const projectAll = (params?: { uid?: number; status?: number; createTime?: string }) => {
	return http<Array<ProjectType>>({
		url: `/v2/project/all`,
		method: 'GET',
		params
	})
}

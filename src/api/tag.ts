/*
 * @Author: 情雨随风
 * @Date: 2020-06-04 21:30:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 23:00:34
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

//获取所有标签
export const TAGAll = () => {
	return http<Array<TAGType>>({
		url: '/api/tag/all',
		method: 'GET'
	})
}

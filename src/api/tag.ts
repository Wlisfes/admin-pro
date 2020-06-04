/*
 * @Author: 情雨随风
 * @Date: 2020-06-04 21:30:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 22:30:24
 * @Description: 标签模块接口
 */

import http from '@/utils/request'

export interface TAG {
	id: number
	name: string
	color: string
	status: number
	sort: number
	createTime: string
	updateTime: string
}

//获取所有标签
export const TAGAll = () => {
	return http<Array<TAG>>({
		url: '/api/tag/all',
		method: 'GET'
	})
}

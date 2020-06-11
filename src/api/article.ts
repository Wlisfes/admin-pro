/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:43:22
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-11 22:35:03
 * @Description: 文章接口
 */

import http from '@/utils/request'
import { TAGType } from '@/api/tag'
import { UserType } from '@/api/user'

export interface ArticleType {
	id: number
	sort: number
	status: number
	reading: number
	title: string
	description: string
	content: string
	picUrl: string
	text: string
	tag: TAGType[]
	user: UserType
}

//文章列表
export const articleAll = (params?: { uid?: number; status?: number; createTime?: string }) => {
	return http<Array<ArticleType>>({
		url: `/v2/article/all`,
		method: 'GET',
		params
	})
}

//置顶文章
export const sortArticle = (params: { id: number }) => {
	return http<ArticleType>({
		url: `/v2/article/sort`,
		method: 'PUT',
		params
	})
}

//切换文章状态
export const cutoverArticle = (params: { id: number }) => {
	return http<ArticleType>({
		url: `/v2/article/cutover`,
		method: 'PUT',
		params
	})
}

//删除文章
export const deleteArticle = (params: { id: number }) => {
	return http({
		url: `/v2/article/delete`,
		method: 'DELETE',
		params
	})
}

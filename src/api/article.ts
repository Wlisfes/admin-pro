/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:43:22
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 14:02:38
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
	html: string
	themeName: string
	createTime: string
	tag: TAGType[]
	user: UserType
}
export interface CreateType {
	title: string
	content: string
	html: string
	picUrl: string
	tag: number[]
	status: number
	themeName: string
	description: string
}
export interface UpdateType extends CreateType {
	id: number
}

//创建文章
export const createArticle = (params: CreateType) => {
	return http<ArticleType>({
		url: `/v2/article/create`,
		method: 'POST',
		data: params
	})
}

//获取文章详情
export const getArticle = (params: { id: number }) => {
	return http<ArticleType>({
		url: `/v2/article/info`,
		method: 'GET',
		params
	})
}

//修改文章
export const updateArticle = (params: UpdateType) => {
	return http<ArticleType>({
		url: `/v2/article/update`,
		method: 'PUT',
		data: params
	})
}

//文章列表
export const articleAll = (params?: { uid?: number; status?: number; tag?: number; createTime?: string }) => {
	return http<{ len: number; article: ArticleType[] }>({
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

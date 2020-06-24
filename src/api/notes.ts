/*
 * @Date: 2020-06-23 17:17:25
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-24 16:42:43
 * @Description: 笔记模块接口
 */

import http from '@/utils/request'
import { TAGType } from '@/api/tag'
import { UserType } from '@/api/user'

export interface NotesType {
	id: number
	sort: number
	status: number
	title: string
	content: string
	picUrl: string
	html: string
	themeName: string
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
}
export interface UpdateType extends CreateType {
	id: number
}

//创建笔记
export const createNotes = (params: CreateType) => {
	return http<NotesType>({
		url: `/v2/notes/create`,
		method: 'POST',
		data: params
	})
}

//获取笔记详情
export const getNotes = (params: { id: number }) => {
	return http<NotesType>({
		url: `/v2/notes/info`,
		method: 'GET',
		params
	})
}

//修改文章
export const updateNotes = (params: UpdateType) => {
	return http<NotesType>({
		url: `/v2/notes/update`,
		method: 'PUT',
		data: params
	})
}

//笔记列表
export const notesAll = (params?: { uid?: number; status?: number; tag?: number; createTime?: string }) => {
	return http<Array<NotesType>>({
		url: `/v2/notes/all`,
		method: 'GET',
		params
	})
}

//置顶笔记
export const sortNotes = (params: { id: number }) => {
	return http<NotesType>({
		url: `/v2/notes/sort`,
		method: 'PUT',
		params
	})
}

//切换笔记状态
export const cutoverNotes = (params: { id: number }) => {
	return http<NotesType>({
		url: `/v2/notes/cutover`,
		method: 'PUT',
		params
	})
}

//删除笔记
export const deleteNotes = (params: { id: number }) => {
	return http({
		url: `/v2/notes/delete`,
		method: 'DELETE',
		params
	})
}

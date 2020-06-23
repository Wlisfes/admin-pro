/*
 * @Date: 2020-06-23 17:17:25
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 17:21:20
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

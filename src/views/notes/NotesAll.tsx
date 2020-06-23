/*
 * @Date: 2020-06-23 16:55:22
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 17:22:23
 * @Description: 笔记列表
 */

import './less/notes.less'
import { Vue, Component } from 'vue-property-decorator'
import { notesAll } from '@/api/notes'

@Component
export default class NotesAll extends Vue {
	protected created() {
		this.notesAll()
	}

	public async notesAll() {
		const response = await notesAll()
		if (response.code === 200) {
			console.log(response)
		}
	}

	protected render() {
		return <div class="root-notes"></div>
	}
}

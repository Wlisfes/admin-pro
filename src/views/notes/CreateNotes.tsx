/*
 * @Date: 2020-06-23 17:06:44
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-24 16:20:22
 * @Description: 新增文章
 */

import './less/notes.less'
import { Vue, Component } from 'vue-property-decorator'
import { NotesForm } from './modules'
import { Meditor, createFile } from '@/components/meditor'
import { createNotes, CreateType } from '@/api/notes'
import { upload } from '@/api'

@Component
export default class CreateNotes extends Vue {
	//表单配置
	private form = {
		self: null,
		props: {
			status: 1
		},
		//表单加载完成触发onReady事件，返回表单实例
		onReady: (self: any) => (this.form.self = self),
		//表单保存事件
		onSubmit: (params: { title: string; picUrl: string; status: number; tag: number[]; timeout: Function }) => {
			const { currentValue, html, themeName } = (this.meditor.self as any).handleSave()
			if (!currentValue || !html) {
				this.$notification.error({ message: '文章内容不可为空', description: '' })
				setTimeout(() => params.timeout(), 600)
				return
			}
			this.create(
				{
					title: params.title,
					tag: params.tag,
					picUrl: params.picUrl,
					status: params.status,
					themeName,
					html,
					content: currentValue
				},
				params.timeout
			)
		}
	}

	//编辑器配置
	private meditor = {
		self: null,
		props: {
			height: 800,
			toolbars: { clear: true }
		},
		//编辑器加载完成触发onReady事件，返回编辑器实例
		onReady: (e: any) => (this.meditor.self = e.self),
		//编辑器上传图片
		onUpload: async (e: { self: any; insertContent: Function }) => {
			const formData = await createFile()
			const response = await upload(formData)
			if (response.code === 200) {
				e.insertContent(response.data.path)
			}
		}
	}

	//创建
	public async create(params: CreateType, timeout: Function) {
		const response = await createNotes(params)
		const self = this.form.self as any
		if (response.code === 200) {
			this.$notification.success({ message: '新增成功', description: '' })
			self.onReply()
		}
		timeout()
	}

	protected render() {
		return (
			<div class="root-notes">
				<NotesForm {...{ props: this.form.props }} onSubmit={this.form.onSubmit} onReady={this.form.onReady} />
				<Meditor
					class="root-meditor"
					height={800}
					toolbars={{ clear: true }}
					onReady={(e: any) => (this.meditor.self = e.self)}
					onUpload={this.meditor.onUpload}
				></Meditor>
			</div>
		)
	}
}

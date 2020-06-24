/*
 * @Author: 情雨随风
 * @Date: 2020-06-20 23:29:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-21 18:17:09
 * @Description: 修改笔记
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { NotesForm } from './index'
import { Modal, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { Meditor, createFile } from '@/components/meditor'
import { upload } from '@/api'
import { getNotes, updateNotes, UpdateType } from '@/api/notes'

@Component
export default class UpdateNotes extends Vue {
	@Prop() visible!: false
	@Prop() id!: number

	private modal = {
		...CommonModal,
		width: '95%',
		centered: false,
		maskClosable: false,
		title: '修改笔记'
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

	//修改配置
	private update = {
		title: '',
		picUrl: '',
		status: 5,
		tag: [],
		themeName: '',
		content: '',
		loading: true,
		reply: true,
		onSubmit: (params: { title: string; picUrl: string; status: number; tag: number[]; timeout: Function }) => {
			const { currentValue, html, themeName } = (this.meditor.self as any).handleSave()
			if (!currentValue || !html) {
				this.$notification.error({ message: '文章内容不可为空', description: '' })
				setTimeout(() => params.timeout(), 600)
				return
			}

			this.updateNotes(
				{
					id: this.id,
					title: params.title,
					tag: params.tag,
					picUrl: params.picUrl,
					status: params.status,
					content: currentValue,
					themeName,
					html
				},
				params.timeout
			)
		}
	}

	//更新
	public async updateNotes(form: UpdateType, timeout: Function) {
		const response = await updateNotes({
			id: form.id,
			title: form.title,
			tag: form.tag,
			picUrl: form.picUrl,
			status: form.status,
			content: form.content,
			themeName: form.themeName,
			html: form.html
		})

		if (response.code === 200) {
			this.$notification.success({ message: '修改成功', description: '' })
			this.$emit('submit')
		}
		timeout()
	}

	protected created() {
		this.getNotes()
	}

	//文章详情获取
	public async getNotes() {
		const response = await getNotes({ id: this.id })
		if (response.code === 200) {
			const { title, tag, picUrl, status, themeName, content } = response.data

			this.update.title = title
			this.update.picUrl = picUrl
			this.update.status = status
			this.update.themeName = themeName
			this.update.content = content
			this.update.tag = tag.map(k => k.id) as []
		}
		this.update.loading = false
	}

	public onCancel() {
		this.$emit('cancel')
	}

	protected render() {
		return (
			<Modal
				getContainer={() => document.querySelector('.root-notes')}
				wrapClassName="update-notes-modal"
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				maskClosable={this.modal.maskClosable}
				footer={null}
				onCancel={this.onCancel}
			>
				<Spin size="large" spinning={this.update.loading}>
					<NotesForm {...{ props: this.update }} onSubmit={this.update.onSubmit}></NotesForm>
					<Meditor
						class="root-meditor"
						height={800}
						value={this.update.content}
						theme={this.update.themeName}
						toolbars={{ clear: true }}
						onReady={this.meditor.onReady}
						onUpload={this.meditor.onUpload}
					></Meditor>
				</Spin>
			</Modal>
		)
	}
}

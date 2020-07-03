/*
 * @Author: 情雨随风
 * @Date: 2020-06-20 23:29:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 15:31:09
 * @Description: 修改文章
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { ArticleForm } from './index'
import { Modal, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { Meditor, createFile } from '@/components/meditor'
import { upload } from '@/api'
import { getArticle, updateArticle, UpdateType } from '@/api/article'

@Component
export default class UpdateArticle extends Vue {
	@Prop() visible!: false
	@Prop() id!: number

	private modal = {
		...CommonModal,
		width: 1400,
		centered: false,
		maskClosable: false,
		title: '修改文章'
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
		description: '',
		picUrl: '',
		status: 5,
		tag: [],
		themeName: '',
		content: '',
		loading: true,
		reply: true,
		onSubmit: (params: {
			title: string
			picUrl: string
			status: number
			description: string
			tag: number[]
			timeout: Function
		}) => {
			const { currentValue, html, themeName } = (this.meditor.self as any).handleSave()
			if (!currentValue || !html) {
				this.$notification.error({ message: '文章内容不可为空', description: '' })
				setTimeout(() => params.timeout(), 600)
				return
			}

			this.updateArticle(
				{
					id: this.id,
					title: params.title,
					tag: params.tag,
					description: params.description,
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

	protected created() {
		this.getArticle()
	}

	//文章详情获取
	public async getArticle() {
		const response = await getArticle({ id: this.id })
		if (response.code === 200) {
			const { title, tag, description, picUrl, status, themeName, content } = response.data

			this.update.title = title
			this.update.description = description
			this.update.picUrl = picUrl
			this.update.status = status
			this.update.themeName = themeName
			this.update.content = content
			this.update.tag = tag.map(k => k.id) as []
		}
		this.update.loading = false
	}

	//更新
	public async updateArticle(form: UpdateType, timeout: Function) {
		const response = await updateArticle({
			id: form.id,
			title: form.title,
			tag: form.tag,
			description: form.description,
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

	public onCancel() {
		this.$emit('cancel')
	}

	protected render() {
		return (
			<Modal
				getContainer={() => document.querySelector('.root-article-all')}
				wrapClassName="update-article-modal"
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
					<ArticleForm {...{ props: this.update }} onSubmit={this.update.onSubmit}></ArticleForm>
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

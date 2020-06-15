/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:28:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-14 23:10:17
 * @Description: 新增文章
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'
import { ArticleForm } from './modules'
import { Meditor } from '@/components/meditor'
import { createArticle, CreateType } from '@/api/article'

@Component
export default class CreateArticle extends Vue {
	//表单配置
	private form = {
		self: null,
		props: { status: 1 },
		//表单加载完成触发onReady事件，返回表单实例
		onReady: (self: any) => (this.form.self = self),
		//表单保存事件
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
			this.create(
				{
					title: params.title,
					tag: params.tag,
					description: params.description,
					picUrl: params.description,
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
			console.log(e)
		}
	}

	//创建
	public async create(params: CreateType, timeout: Function) {
		const response = await createArticle(params)
		if (response.code === 200) {
			console.log(response)
		}
		timeout()
	}

	protected render() {
		return (
			<div class="root-article">
				<ArticleForm
					{...{ props: this.form.props }}
					onSubmit={this.form.onSubmit}
					onReady={this.form.onReady}
				/>
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

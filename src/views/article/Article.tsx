/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:38:55
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-04 12:27:59
 * @Description: 文章列表
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'
import { Spin, Empty } from 'ant-design-vue'
import { ArticleSpin, More, TermForm } from '@/components/common'
import { UpdateArticle } from './modules'
import { articleAll, sortArticle, cutoverArticle, deleteArticle, ArticleType } from '@/api/article'
import moment from 'moment'

@Component
export default class Article extends Vue {
	private table = {
		loading: true,
		more: false,
		limit: 10,
		len: 0,
		dataSource: []
	}

	//修改文章配置
	private update = {
		id: 0,
		visible: false,
		onCancel: () => (this.update.visible = false),
		onSubmit: () => {
			this.table.loading = true
			this.update.visible = false
			setTimeout(() => this.articleAll(), 300)
		}
	}

	//查询组件配置
	private termForm = {
		self: null,
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.articleAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.articleAll(params), 300)
		}
	}

	protected created() {
		this.articleAll({ limit: 5 })
	}

	//文章列表
	public async articleAll(params?: any) {
		const response = await articleAll(params)
		if (response.code === 200) {
			const { len, article } = response.data
			this.table.len = len
			this.table.dataSource = article as []
		}
		this.table.loading = false
	}

	//操作
	public async onChange({ key, props }: { key: string; props: ArticleType }) {
		this.table.loading = true

		//获取查询表单数据
		const params = (this.termForm.self as any).getValue()
		const limit = this.table.dataSource.length || 5

		//更新文章
		if (key === 'update') {
			this.update.id = props.id
			this.update.visible = true
		}

		//置顶文章
		if (key === 'sort') {
			const response = await sortArticle({ id: props.id })
			if (response.code === 200) {
				//合并查询
				this.articleAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverArticle({ id: props.id })
			if (response.code === 200) {
				//合并查询
				this.articleAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		//删除文章
		if (key === 'delete') {
			const response = await deleteArticle({ id: props.id })
			if (response.code === 200) {
				//合并查询
				this.articleAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		this.table.loading = false
	}

	//时间转换
	public transform(createTime: string) {
		return moment(createTime)
			.startOf('ms')
			.fromNow()
	}

	//加载更多
	public async AppMore() {
		this.table.more = true

		//获取查询表单数据
		const params = (this.termForm.self as any).getValue()

		//合并查询
		const response = await articleAll(
			Object.assign({}, params, {
				limit: this.table.limit,
				offset: this.table.dataSource.length
			})
		)
		if (response.code === 200) {
			const { len, article } = response.data
			this.table.len = len
			this.table.dataSource = this.table.dataSource.concat(article as [])
		}
		this.table.more = false
	}

	protected render() {
		return (
			<div class="root-article">
				{this.update.visible && (
					<UpdateArticle
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					></UpdateArticle>
				)}
				<TermForm
					style={{ margin: '24px 24px 0' }}
					{...{ props: { createHide: true } }}
					onLoad={(self: any) => (this.termForm.self = self)}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				></TermForm>
				<Spin
					size="large"
					spinning={this.table.loading}
					style={{ flex: 1, margin: '12px 0 0', overflow: 'hidden', maxWidth: '1400px' }}
				>
					<div class="spin-container">
						{this.table.dataSource.length === 0 ? (
							<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '64px 24px' }} />
						) : (
							<div class="article">
								{this.table.dataSource.map((props: ArticleType) => (
									<ArticleSpin
										{...{ props: { ...props, params: props } }}
										onChange={this.onChange}
									></ArticleSpin>
								))}

								<More
									more={this.table.len === this.table.dataSource.length}
									loading={this.table.more}
									onMore={this.AppMore}
								></More>
							</div>
						)}
					</div>
				</Spin>
			</div>
		)
	}
}

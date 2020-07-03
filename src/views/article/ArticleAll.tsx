/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:38:55
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 15:28:28
 * @Description: 文章列表
 */

import './less/article.all.less'
import { Vue, Component } from 'vue-property-decorator'
import { Button, Avatar, Tag, Spin, Divider, Empty } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { UpdateArticle } from './modules'
import { articleAll, sortArticle, cutoverArticle, deleteArticle, ArticleType } from '@/api/article'
import { TAGAll, TAGType } from '@/api/tag'
import { Color } from '@/interface'
import moment from 'moment'

@Component
class ArticleAll extends Vue {
	private table = {
		loading: true,
		more: false,
		limit: 10,
		len: 0,
		dataSource: []
	}

	private TAG = {
		all: [],
		loading: true,
		show: false
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
		onCreate: () => {
			this.TAG.show = true
		},
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
		this.TAGAll()
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

	//标签列表
	public async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.TAG.all = response.data as []
		}
		this.TAG.loading = false
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
			<div class="root-article-all">
				{this.update.visible && (
					<UpdateArticle
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					></UpdateArticle>
				)}
				<TermForm
					{...{ props: { createHide: true } }}
					onLoad={(self: any) => (this.termForm.self = self)}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				></TermForm>
				<Spin
					size="large"
					spinning={this.table.loading}
					style={{ flex: 1, margin: '12px 0 0', maxWidth: '1400px' }}
				>
					<div class="spin-container">
						{this.table.dataSource.length === 0 ? (
							<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '64px 24px' }} />
						) : (
							<div class="article">
								{this.table.dataSource.map((k: ArticleType) => (
									<div class="spin-item">
										<div class="spin-item-cursor">
											<div style={{ flex: 1 }}>
												<div class="cursor-user">
													<Avatar class="cursor-user-avatar" src={k.user.avatar} size={40} />
													<div class="cursor-user-nickname">{k.user.nickname}</div>
													<div class="cursor-user-createTime">
														{this.transform(k.createTime)}
													</div>
													<Tag
														style={{ cursor: 'pointer', margin: '0 0 0 8px' }}
														color={k.status ? 'green' : 'pink'}
													>
														{k.status ? '正常' : '已禁用'}
													</Tag>
												</div>
												<div class="cursor-title">{k.title}</div>
												<div class="cursor-content">{k.description}</div>
											</div>
											<div>
												<img
													class="article-picUrl"
													src={`${k.picUrl}?x-oss-process=style/resize_50`}
													alt=""
												/>
											</div>
										</div>
										<div class="spin-item-footer">
											<div class="cursor-tags">
												{k.tag.map(x => (
													<Tag
														key={x.id}
														color={x.color}
														style={{ cursor: 'pointer', marginTop: '8px' }}
													>
														{x.name}
													</Tag>
												))}
											</div>
											<div class="cursor-active">
												<div class="cursor-active-pointer"></div>
												<CommEdit
													params={{
														props: k,
														first: { key: 'update', name: '编辑' },
														last: { key: 'more', name: '更多', more: true },
														menu: [
															{
																key: 'sort',
																name: '置顶',
																icon: 'arrow-up',
																color: Color.import
															},
															{
																key: 'status',
																name: k.status ? '禁用' : '开放',
																icon: k.status ? 'stop' : 'check-circle',
																color: k.status ? Color.warn : Color.ok
															},
															{
																key: 'delete',
																name: '删除',
																icon: 'rest',
																color: Color.delete
															}
														]
													}}
													onChange={this.onChange}
												/>
											</div>
										</div>
									</div>
								))}

								<div class="article-more">
									{this.table.len === this.table.dataSource.length ? (
										<Divider dashed>没有更多了</Divider>
									) : (
										<Button
											loading={this.table.more}
											style={{ cursor: 'pointer' }}
											onClick={this.AppMore}
										>
											加载更多
										</Button>
									)}
								</div>
							</div>
						)}
					</div>
				</Spin>
			</div>
		)
	}
}

export default ArticleAll

/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:38:55
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-13 11:30:17
 * @Description: 文章列表
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Tooltip, Spin, Select, Badge } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { articleAll, sortArticle, cutoverArticle, deleteArticle, ArticleType } from '@/api/article'
import { TAGAll, TAGType } from '@/api/tag'
import { Color } from '@/interface'
import moment from 'moment'

@Component
class ArticleAll extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '文章标题', width: '20%', dataIndex: 'title', scopedSlots: { customRender: 'renderTitle' } },
			{ title: '文章作者', width: '12%', dataIndex: 'user', scopedSlots: { customRender: 'user' } },
			{ title: '标签类别', dataIndex: 'tag', scopedSlots: { customRender: 'tag' } },
			{ title: '创建时间', width: 120, dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', width: 95, dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	private TAG = {
		all: [],
		loading: true,
		show: false
	}

	//查询组件配置
	private termForm = {
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
		this.articleAll()
		this.TAGAll()
	}

	//文章列表
	public async articleAll(params?: any) {
		const response = await articleAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
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

		//置顶文章
		if (key === 'sort') {
			const response = await sortArticle({ id: props.id })
			if (response.code === 200) {
				this.articleAll()
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverArticle({ id: props.id })
			if (response.code === 200) {
				this.articleAll()
				return
			}
		}

		//删除文章
		if (key === 'delete') {
			const response = await deleteArticle({ id: props.id })
			if (response.code === 200) {
				this.articleAll()
				return
			}
		}

		this.table.loading = false
	}

	protected render() {
		return (
			<div class="root-article">
				<TermForm
					{...{
						props: {
							two: {
								replace: true,
								key: 'tag',
								label: '类别',
								render: () => (
									<Select mode="default" placeholder="请选择">
										{this.TAG.loading && (
											<Spin
												slot="notFoundContent"
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding: '24px 0'
												}}
											/>
										)}
										{this.TAG.all.map((k: TAGType) => (
											<Select.Option key={k.id}>{k.name}</Select.Option>
										))}
									</Select>
								)
							},
							there: {
								replace: true,
								key: 'status',
								label: '状态',
								render: () => (
									<Select mode="default" placeholder="请选择">
										<Select.Option key={1}>
											<Badge color="green" text="已开放" />
										</Select.Option>
										<Select.Option key={0}>
											<Badge color="pink" text="已禁用" />
										</Select.Option>
									</Select>
								)
							}
						}
					}}
					onCreate={this.termForm.onCreate}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				></TermForm>
				<Table
					class="root-table"
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 1100 }}
					{...{
						scopedSlots: {
							expandedRowRender: (props: ArticleType) => <div>{props.description}</div>,
							renderTitle: (title: string) => (
								<div class="root-table-content">
									<Tooltip placement="top" title={title}>
										<span class="row-ellipsis">{title}</span>
									</Tooltip>
								</div>
							),
							user: (user: any) => (
								<div class="root-table-content">
									<Tooltip placement="top" title={user.nickname}>
										<span class="row-ellipsis">{user.nickname}</span>
									</Tooltip>
								</div>
							),
							tag: (tag: any, props: ArticleType) => (
								<div class="root-table-content">
									{props.tag.map(k => (
										<Tooltip placement="top" title={k.name}>
											<Tag style={{ cursor: 'pointer' }} color={k.color}>
												{k.name}
											</Tag>
										</Tooltip>
									))}
								</div>
							),
							createTime: (createTime: string) => <div>{moment(createTime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => (
								<Tag style={{ cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: ArticleType) => (
								<CommEdit
									params={{
										props,
										first: { key: 'update', name: '编辑' },
										last: { key: 'more', name: '更多', more: true },
										menu: [
											{ key: 'sort', name: '置顶', icon: 'arrow-up', color: Color.import },
											{
												key: 'status',
												name: props.status ? '禁用' : '开放',
												icon: props.status ? 'stop' : 'check-circle',
												color: props.status ? Color.warn : Color.ok
											},
											{ key: 'delete', name: '删除', icon: 'rest', color: Color.delete }
										]
									}}
									onChange={this.onChange}
								/>
							)
						}
					}}
					pagination={{
						pageSize: this.table.pageSize,
						pageSizeOptions: this.table.pageSizeOptions,
						showSizeChanger: this.table.showSizeChanger,
						current: this.table.current
					}}
					onChange={(ops: any) => {
						this.table.current = ops.current
						this.table.pageSize = ops.pageSize
					}}
				></Table>
			</div>
		)
	}
}

export default ArticleAll

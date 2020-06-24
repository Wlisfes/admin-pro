/*
 * @Date: 2020-06-23 16:55:22
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-24 16:38:09
 * @Description: 笔记列表
 */

import './less/notes.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Tooltip, Spin, Select, Badge } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { UpdateNotes } from './modules'
import { notesAll, sortNotes, cutoverNotes, deleteNotes, NotesType } from '@/api/notes'
import { TAGAll, TAGType } from '@/api/tag'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class NotesAll extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '笔记标题', width: '20%', dataIndex: 'title', scopedSlots: { customRender: 'renderTitle' } },
			{ title: '笔记作者', width: '12%', dataIndex: 'user', scopedSlots: { customRender: 'user' } },
			{ title: '笔记类别', dataIndex: 'tag', scopedSlots: { customRender: 'tag' } },
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

	//修改文章配置
	private update = {
		id: 0,
		visible: false,
		onCancel: () => (this.update.visible = false),
		onSubmit: () => {
			this.table.loading = true
			this.update.visible = false
			setTimeout(() => this.notesAll(), 300)
		}
	}

	//查询组件配置
	private termForm = {
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.notesAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.notesAll(params), 300)
		}
	}

	protected created() {
		this.notesAll()
		this.TAGAll()
	}

	//笔记列表
	public async notesAll(params?: any) {
		const response = await notesAll(params)
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
	public async onChange({ key, props }: { key: string; props: NotesType }) {
		this.table.loading = true

		//更新
		if (key === 'update') {
			this.update.id = props.id
			this.update.visible = true
		}

		//置顶笔记
		if (key === 'sort') {
			const response = await sortNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll()
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll()
				return
			}
		}

		//删除笔记
		if (key === 'delete') {
			const response = await deleteNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll()
				return
			}
		}

		this.table.loading = false
	}

	protected render() {
		return (
			<div class="root-notes">
				{this.update.visible && (
					<UpdateNotes
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					></UpdateNotes>
				)}

				<TermForm
					{...{
						props: {
							there: {
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
							createHide: true
						}
					}}
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
							tag: (tag: any, props: NotesType) => (
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
							action: (action: any, props: NotesType) => (
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

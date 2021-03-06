/*
 * @Date: 2020-06-08 08:39:19
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-09 13:03:41
 * @Description: 标签列表
 */

import './less/tag.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Tooltip } from 'ant-design-vue'
import { TAGAll, cutoverTAG, deleteTAG, sortTAG, TAGType } from '@/api/tag'
import { CommEdit, TermForm } from '@/components/common'
import { UpdateTAG, CreateTAG } from './modules'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class TAG extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '标签名称', width: '20%', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
			{ title: '标签作者', dataIndex: 'user', scopedSlots: { customRender: 'user' } },
			{ title: '创建时间', width: '22%', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', width: '16%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	//标签修改配置
	private update = {
		visible: false,
		id: 0,
		onCancel: () => (this.update.visible = false),
		onSubmit: () => {
			this.table.loading = true
			this.TAGAll()
			this.update.visible = false
		}
	}

	//标签新增配置
	private create = {
		visible: false,
		onCancel: () => (this.create.visible = false),
		onSubmit: () => {
			this.table.loading = true
			this.TAGAll()
			this.create.visible = false
		}
	}

	//查询组件配置
	private termForm = {
		onCreate: () => (this.create.visible = true),
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.TAGAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.TAGAll(params), 300)
		}
	}

	protected created() {
		this.TAGAll()
	}

	//获取所有标签列表
	async TAGAll(params?: any) {
		const response = await TAGAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	async onChange({ key, props }: { key: string; props: TAGType }) {
		this.table.loading = true

		//修改标签信息
		if (key === 'update') {
			this.update.id = props.id
			this.update.visible = true
		}

		//置顶标签
		if (key === 'sort') {
			const response = await sortTAG({ id: props.id })
			if (response.code === 200) {
				this.TAGAll()
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverTAG({ id: props.id })
			if (response.code === 200) {
				this.TAGAll()
				return
			}
		}

		//删除角标签
		if (key === 'delete') {
			const response = await deleteTAG({ id: props.id })
			if (response.code === 200) {
				this.TAGAll()
				return
			}
		}

		this.table.loading = false
	}

	render() {
		return (
			<div class="root-tag">
				{this.update.visible && (
					<UpdateTAG
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					/>
				)}

				{this.create.visible && (
					<CreateTAG
						{...{ props: this.create }}
						onCancel={this.create.onCancel}
						onSubmit={this.create.onSubmit}
					/>
				)}

				<TermForm
					onCreate={this.termForm.onCreate}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				></TermForm>
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 600 }}
					{...{
						scopedSlots: {
							name: (name: string, props: TAGType) => (
								<Tooltip placement="top" title={name}>
									<Tag color={props.color} style={{ cursor: 'pointer' }}>
										{name}
									</Tag>
								</Tooltip>
							),
							user: (user: any) => (
								<Tooltip placement="top" title={user.nickname}>
									<span style={{ cursor: 'pointer' }}>{user.nickname}</span>
								</Tooltip>
							),
							createTime: (createTime: string) => <div>{moment(createTime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => (
								<Tag style={{ cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: TAGType) => (
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

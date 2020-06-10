/*
 * @Date: 2020-06-09 13:01:55
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-09 17:29:12
 * @Description: 项目列表
 */

import './less/project.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Tooltip } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { projectAll, cutoverProject, sortProject, deleteProject, ProjectType } from '@/api/project'
import { CreateProject, UpdateProject } from './modules'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class Project extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{
				title: '项目名称',
				width: '11%',
				ellipsis: true,
				dataIndex: 'title',
				scopedSlots: { customRender: 'renderTitle' }
			},
			{
				title: '项目作者',
				width: '10%',
				ellipsis: true,
				dataIndex: 'user',
				scopedSlots: { customRender: 'user' }
			},
			{ title: '标签类别', dataIndex: 'tag', scopedSlots: { customRender: 'tag' } },
			{ title: '源码地址', width: '8.6%', dataIndex: 'github', scopedSlots: { customRender: 'github' } },
			{ title: '创建时间', width: '11%', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', width: 80, dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	//查询组件配置
	private termForm = {
		onCreate: () => {
			this.create.visible = true
		},
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.projectAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.projectAll(params), 300)
		}
	}

	//新增弹窗配置
	private create = {
		visible: false,
		onCancel: () => {
			this.create.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.projectAll()
			this.create.visible = false
		}
	}

	//修改弹窗配置
	private update = {
		id: 0,
		visible: false,
		onCancel: () => {
			this.update.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.projectAll()
			this.update.visible = false
		}
	}

	protected created() {
		this.projectAll()
	}

	//获取所有项目列表
	public async projectAll(params?: any) {
		const response = await projectAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	public async onChange({ key, props }: { key: string; props: ProjectType }) {
		this.table.loading = true

		//修改项目信息
		if (key === 'update') {
			this.update.id = props.id
			this.update.visible = true
		}

		//置顶标签
		if (key === 'sort') {
			const response = await sortProject({ id: props.id })
			if (response.code === 200) {
				this.projectAll()
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverProject({ id: props.id })
			if (response.code === 200) {
				this.projectAll()
				return
			}
		}

		//删除角标签
		if (key === 'delete') {
			const response = await deleteProject({ id: props.id })
			if (response.code === 200) {
				this.projectAll()
				return
			}
		}

		this.table.loading = false
	}

	protected render() {
		return (
			<div class="root-project">
				{/**项目新增组件**/
				this.create.visible && (
					<CreateProject
						{...{ props: this.create }}
						onCancel={this.create.onCancel}
						onSubmit={this.create.onSubmit}
					/>
				)}

				{/**项目修改组件**/
				this.update.visible && (
					<UpdateProject
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					/>
				)}

				<TermForm
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
							expandedRowRender: (props: ProjectType) => <div>{props.description}</div>,
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
							tag: (tag: any, props: ProjectType) => (
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
							github: (github: string) => {
								return (
									<Tooltip placement="top" title={github}>
										<Tag color="blue" style="margin: 0 auto;">
											<a href={github} target="_blank" rel="noopener noreferrer">
												GitHub
											</a>
										</Tag>
									</Tooltip>
								)
							},
							createTime: (createTime: string) => <div>{moment(createTime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => (
								<Tag style={{ cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: ProjectType) => (
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

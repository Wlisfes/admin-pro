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
import { projectAll, ProjectType } from '@/api/project'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class Project extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '项目名称', dataIndex: 'title' },
			{ title: '项目作者', width: 95, ellipsis: true, dataIndex: 'user', scopedSlots: { customRender: 'user' } },
			{ title: '项目描述', dataIndex: 'description', scopedSlots: { customRender: 'description' } },
			{ title: '标签类别', dataIndex: 'tag', scopedSlots: { customRender: 'tag' } },
			{ title: '源码地址', dataIndex: 'github', scopedSlots: { customRender: 'github' } },
			{ title: '创建时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
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
			// this.updateTagModal.visible = true
		},
		onReply: () => {
			// this.table.loading = true
			// setTimeout(() => this.TAGAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.projectAll(params), 300)
		}
	}

	protected created() {
		this.projectAll()
	}

	async projectAll(params?: any) {
		const response = await projectAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	protected render() {
		return (
			<div class="root-project">
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
					{...{
						scopedSlots: {
							user: (user: any) => (
								<Tooltip placement="top" title={user.nickname}>
									<span class="root-ellipsis">收取单个战利品收取单个战利品</span>
								</Tooltip>
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
									onChange={(e: any) => console.log(e)}
								/>
							)
						}
					}}
				></Table>
			</div>
		)
	}
}

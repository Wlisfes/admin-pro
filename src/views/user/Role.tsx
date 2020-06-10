/*
 * @Author: 情雨随风
 * @Date: 2020-04-25 19:26:29
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-10 22:50:44
 * @Description: 新增角色弹窗
 */

import './less/role.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Input, Tag } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { UpdateRole, CreateRole } from './modules'
import { roleAll, cutoverRole, deleteRole, RoleType } from '@/api/role'
import { Color } from '@/interface'

@Component
export default class Role extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '唯一识别码', width: '25%', dataIndex: 'role_key' },
			{ title: '权限名称', width: '25%', dataIndex: 'role_name' },
			{ title: '状态', width: '25%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	//编辑弹窗配置
	private updateRole = {
		visible: false,
		id: 0,
		onCancel: () => {
			this.updateRole.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.roleAll()
			this.updateRole.visible = false
		}
	}

	//新增弹窗配置
	private createRole = {
		visible: false,
		onCancel: () => {
			this.createRole.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.roleAll()
			this.createRole.visible = false
		}
	}

	//查询组件配置
	private termForm = {
		onCreate: () => {
			this.createRole.visible = true
		},
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.roleAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.roleAll(params), 300)
		}
	}

	created() {
		this.roleAll()
	}

	//获取所有角色列表
	async roleAll(params?: any) {
		const response = await roleAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}

		this.table.loading = false
	}

	//操作
	async onChange({ key, props }: { key: string; props: RoleType }) {
		this.table.loading = true

		//修改角色
		if (key === 'update') {
			this.updateRole.id = props.id
			this.updateRole.visible = true
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverRole({ id: props.id })
			if (response.code === 200) {
				this.roleAll()
				return
			}
		}

		//删除角色
		if (key === 'delete') {
			const response = await deleteRole({ id: props.id })
			if (response.code === 200) {
				this.roleAll()
				return
			}
		}

		this.table.loading = false
	}

	render() {
		return (
			<div class="admin-role">
				{/**新增角色弹窗**/
				this.createRole.visible && (
					<CreateRole
						{...{ props: this.createRole }}
						onCancel={this.createRole.onCancel}
						onSubmit={this.createRole.onSubmit}
					/>
				)}

				{/**编辑角色弹窗**/
				this.updateRole.visible && (
					<UpdateRole
						{...{ props: this.updateRole }}
						onCancel={this.updateRole.onCancel}
						onSubmit={this.updateRole.onSubmit}
					/>
				)}

				<TermForm
					{...{
						props: {
							one: {
								replace: true,
								key: 'role_name',
								label: '名称',
								render: () => <Input type="text" allowClear placeholder="请输入标识码或者名称" />
							}
						}
					}}
					onCreate={this.termForm.onCreate}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				/>
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 520 }}
					{...{
						scopedSlots: {
							status: (status: number) => (
								<Tag style={{ marginRight: 0, cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: RoleType) => (
								<CommEdit
									params={{
										props,
										first: { key: 'update', name: '编辑' },
										last: { key: 'more', name: '更多', more: true },
										menu: [
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

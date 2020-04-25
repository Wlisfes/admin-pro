/*
 * @Author: 情雨随风
 * @Date: 2020-04-25 19:26:29
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-25 19:58:51
 * @Description: 新增角色弹窗
 */

import './less/role.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Button, Tag } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { UpdateRoleModal, CreateRoleModal } from './modules'
import { roleAll, changeRole, deleteRole, RoleInter, AuthInter } from '@/api/role'

@Component
export default class Role extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '唯一识别码', width: '12.75%', dataIndex: 'role_key' },
			{ title: '权限名称', width: '12.75%', dataIndex: 'role_name' },
			{ title: '可操作权限', dataIndex: 'auth', scopedSlots: { customRender: 'auth' } },
			{ title: '状态', width: '9.25%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
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
	private updateRoleModal = {
		visible: false,
		id: '',
		role_key: '',
		role_name: '',
		status: 1,
		auth: [],
		onCancel: () => {
			this.updateRoleModal.visible = false
		},
		onSubmit: () => {
			this.roleAll()
			this.updateRoleModal.visible = false
		}
	}

	//新增弹窗配置
	private createRoleModal = {
		visible: false,
		onCancel: () => {
			this.createRoleModal.visible = false
		},
		onSubmit: () => {
			this.roleAll()
			this.createRoleModal.visible = false
		}
	}

	created() {
		this.roleAll()
	}

	//获取所有角色列表
	async roleAll() {
		const response = await roleAll()
		if (response.code === 200) {
			this.table.dataSource = response.data
		}

		this.table.loading = false
	}

	//操作
	async onAction(params: RoleInter) {
		if (params.key === 'update') {
			this.updateRoleModal.id = params.id as string
			this.updateRoleModal.auth = params.auth as []
			this.updateRoleModal.role_key = params.role_key as string
			this.updateRoleModal.role_name = params.role_name as string
			this.updateRoleModal.status = params.status as number
			this.updateRoleModal.visible = true
			return
		} else if (params.key === 'delete') {
			this.table.loading = true
			const response = await deleteRole({ id: params.id as string })
			if (response.code === 200) {
				this.$notification.success({ message: '成功', description: '删除成功' })
				this.roleAll()
				return
			}
		} else {
			this.table.loading = true
			const response = await changeRole({
				id: params.id as string,
				status: params.key === 'open' ? 1 : 0
			})
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
				{
					/**
					 * 新增角色弹窗
					 */
					<CreateRoleModal
						{...{ props: this.createRoleModal }}
						onCancel={this.createRoleModal.onCancel}
						onSubmit={this.createRoleModal.onSubmit}
					></CreateRoleModal>
				}

				{
					/**
					 * 编辑角色弹窗
					 */
					<UpdateRoleModal
						{...{ props: this.updateRoleModal }}
						onCancel={this.updateRoleModal.onCancel}
						onSubmit={this.updateRoleModal.onSubmit}
					></UpdateRoleModal>
				}

				<Button onClick={() => (this.createRoleModal.visible = true)}>新增</Button>
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 800 }}
					{...{
						scopedSlots: {
							auth: (auth: Array<AuthInter>) => (
								<div>
									{auth.map((k, i) => (
										<Tag
											key={k.auth_key}
											color={'cyan'}
											style={{ cursor: 'pointer', margin: '4px' }}
										>
											{k.auth_name}
										</Tag>
									))}
								</div>
							),
							status: (status: number) => (
								<Tag style={{ marginRight: 0, cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: any) => (
								<Actions params={props} onActions={this.onAction}></Actions>
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

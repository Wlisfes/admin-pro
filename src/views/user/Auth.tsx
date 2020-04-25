/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:46:57
 * @Description: 模块权限管理
 */

import './less/auth.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Button } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { UpdateAuthModal, CreateAuthModal } from './modules'
import { authAll, deleteAuth, changeAuth, AuthInter, Apply } from '@/api/auth'
import { Color } from '@/interface/common'

@Component
export default class Auth extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '唯一识别码', width: '13.75%', dataIndex: 'auth_key' },
			{ title: '权限名称', width: '12.5%', dataIndex: 'auth_name' },
			{ title: '可操作权限', dataIndex: 'apply', scopedSlots: { customRender: 'apply' } },
			{ title: '状态', width: '10%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
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
	private updateAuthModal = {
		visible: false,
		id: '',
		all: false,
		apply: [],
		auth_key: '',
		auth_name: '',
		status: 1,
		onCancel: () => {
			this.updateAuthModal.visible = false
		},
		onSubmit: () => {
			this.authAll()
			this.updateAuthModal.visible = false
		}
	}

	//新增弹窗配置
	private createAuthModal = {
		visible: false,
		onCancel: () => {
			this.createAuthModal.visible = false
		},
		onSubmit: () => {
			this.authAll()
			this.createAuthModal.visible = false
		}
	}

	created() {
		this.authAll()
	}

	//获取所有权限模块列表
	async authAll() {
		const response = await authAll()
		if (response.code === 200) {
			this.table.dataSource = response.data
		}
		this.table.loading = false
	}

	//操作
	async onAction(params: AuthInter) {
		if (params.key === 'update') {
			this.updateAuthModal.visible = true
			this.updateAuthModal.apply = params.apply as []
			this.updateAuthModal.id = params.id as string
			this.updateAuthModal.status = params.status
			this.updateAuthModal.auth_key = params.auth_key
			this.updateAuthModal.auth_name = params.auth_name
			return
		} else if (params.key === 'delete') {
			this.table.loading = true
			const response = await deleteAuth({ id: params.id as string })
			if (response.code === 200) {
				this.$notification.success({ message: '成功', description: '删除成功' })
				this.authAll()
				return
			}
		} else {
			this.table.loading = true
			const response = await changeAuth({
				id: params.id as string,
				status: params.key === 'open' ? 1 : 0
			})
			if (response.code === 200) {
				this.authAll()
				return
			}
		}
		this.table.loading = false
	}

	render() {
		return (
			<div class="admin-auth">
				{
					/**
					 *新增权限弹窗
					 */
					<CreateAuthModal
						{...{ props: this.createAuthModal }}
						onCancel={this.createAuthModal.onCancel}
						onSubmit={this.createAuthModal.onSubmit}
					></CreateAuthModal>
				}

				{
					/**
					 * 编辑权限弹窗
					 */
					<UpdateAuthModal
						{...{ props: this.updateAuthModal }}
						onCancel={this.updateAuthModal.onCancel}
						onSubmit={this.updateAuthModal.onSubmit}
					></UpdateAuthModal>
				}

				<Button onClick={() => (this.createAuthModal.visible = true)}>新增</Button>
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 800 }}
					{...{
						scopedSlots: {
							apply: (apply: Array<Apply>) => (
								<div>
									{apply.map(k =>
										k.status ? (
											<Tag
												key={k.apply_key}
												color={(Color as any)[k.apply_key]}
												style={{ cursor: 'pointer' }}
											>
												{k.apply_name}
											</Tag>
										) : null
									)}
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

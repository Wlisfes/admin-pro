/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-05 09:37:06
 * @Description: 模块权限管理
 */

import './less/auth.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Button } from 'ant-design-vue'
import { CommEdit } from '@/components/common'
import { UpdateAuthModal, CreateAuthModal } from './modules'
import { authAll, deleteAuth, cutoverAuth, AuthType, ApplyType } from '@/api/auth'
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
		id: 0,
		onCancel: () => {
			this.updateAuthModal.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
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
			this.table.loading = true
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
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	async onChange({ key, props }: { key: string; props: AuthType }) {
		this.table.loading = true

		//修改
		if (key === 'update') {
			this.updateAuthModal.id = props.id
			this.updateAuthModal.visible = true
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverAuth({ id: props.id })
			if (response.code === 200) {
				this.authAll()
				return
			}
		}

		//删除
		if (key === 'delete') {
			const response = await deleteAuth({ id: props.id })
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
				{/**新增权限弹窗**/
				this.createAuthModal.visible && (
					<CreateAuthModal
						{...{ props: this.createAuthModal }}
						onCancel={this.createAuthModal.onCancel}
						onSubmit={this.createAuthModal.onSubmit}
					/>
				)}

				{/**编辑权限弹窗**/
				this.updateAuthModal.visible && (
					<UpdateAuthModal
						{...{ props: this.updateAuthModal }}
						onCancel={this.updateAuthModal.onCancel}
						onSubmit={this.updateAuthModal.onSubmit}
					/>
				)}

				<Button style={{ marginBottom: '16px' }} onClick={() => (this.createAuthModal.visible = true)}>
					新增
				</Button>
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 800 }}
					{...{
						scopedSlots: {
							apply: (apply: ApplyType[]) => (
								<div>
									{apply.map(k =>
										k.status ? (
											<Tag
												key={k.key}
												color={(Color as any)[k.key]}
												style={{ cursor: 'pointer' }}
											>
												{k.name}
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
							action: (action: any, props: AuthType) => (
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

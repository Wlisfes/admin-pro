/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-05 09:37:06
 * @Description: 模块权限管理
 */

import './less/auth.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Input } from 'ant-design-vue'
import { CommEdit, TermForm } from '@/components/common'
import { UpdateAuth, CreateAuth } from './modules'
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
	private updateAuth = {
		visible: false,
		id: 0,
		onCancel: () => {
			this.updateAuth.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.authAll()
			this.updateAuth.visible = false
		}
	}

	//新增弹窗配置
	private createAuth = {
		visible: false,
		onCancel: () => {
			this.createAuth.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.authAll()
			this.createAuth.visible = false
		}
	}

	//查询组件配置
	private termForm = {
		onCreate: () => {
			this.createAuth.visible = true
		},
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.authAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.authAll(params), 300)
		}
	}

	protected created() {
		this.authAll()
	}

	//获取所有权限模块列表
	public async authAll(params?: any) {
		const response = await authAll(params)
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	public async onChange({ key, props }: { key: string; props: AuthType }) {
		this.table.loading = true

		//修改
		if (key === 'update') {
			this.updateAuth.id = props.id
			this.updateAuth.visible = true
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

	protected render() {
		return (
			<div class="admin-auth">
				{/**新增权限弹窗**/
				this.createAuth.visible && (
					<CreateAuth
						{...{ props: this.createAuth }}
						onCancel={this.createAuth.onCancel}
						onSubmit={this.createAuth.onSubmit}
					/>
				)}

				{/**编辑权限弹窗**/
				this.updateAuth.visible && (
					<UpdateAuth
						{...{ props: this.updateAuth }}
						onCancel={this.updateAuth.onCancel}
						onSubmit={this.updateAuth.onSubmit}
					/>
				)}

				<TermForm
					{...{
						props: {
							one: {
								replace: true,
								key: 'auth_name',
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

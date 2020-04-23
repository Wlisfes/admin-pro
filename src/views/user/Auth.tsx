/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-23 16:51:17
 * @Description: 模块权限管理
 */

import './less/auth.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Table, Tag, Modal, Checkbox, Radio } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { authAll, createAuth, deleteAuth, changeAuth, updateAuth } from '@/api/auth'
import { CommonModalConf, Color } from '@/interface/common'

interface Apply {
	status: number
	apply_key: string
	apply_name: string
}
interface AuthInter {
	id: string
	auth_key: string
	auth_name: string
	apply: Array<Apply>
	all: boolean
	key?: string
	status: number
	[key: string]: any
}

@Component({
	props: { form: { type: Object } }
})
class Auth extends Vue {
	private form: any
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
		loading: false,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 2
	}

	private authModal = {
		...CommonModalConf,
		title: '编辑权限',
		onCancel: () => {
			this.authModal.loading = false
			this.authModal.visible = false
		},
		onSubmit: () => {
			this.authModal.loading = true
			this.form.validateFields(async (err: any, form: AuthInter) => {
				if (err) {
					setTimeout(() => {
						this.authModal.loading = false
					}, 600)
					return
				}
				console.log(form)
				const apply = this.authModal.apply.map((k: Apply) => {
					const status = (form.apply as []).some((key: string) => key === k.apply_key)
					return { ...k, status: Number(status) }
				})
				const response = await updateAuth({
					id: form.id,
					auth_key: form.auth_key,
					auth_name: form.auth_name,
					apply: apply,
					status: form.status,
					all: apply.every((k: Apply) => k.status === 1)
				})

				if (response.code === 200) {
					this.authAll()
					this.$notification.success({ message: '成功', description: '修改成功' })
				}
				this.authModal.onCancel()
			})
		},
		id: '',
		all: false,
		apply: [],
		auth_key: '',
		auth_name: '',
		status: 1
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
	async handelAction(params: AuthInter) {
		if (params.key === 'update') {
			this.authModal.visible = true
			this.authModal.apply = params.apply as []
			this.authModal.id = params.id
			this.authModal.status = params.status
			this.authModal.auth_key = params.auth_key
			this.authModal.auth_name = params.auth_name
			return
		} else if (params.key === 'delete') {
			this.table.loading = true
			const response = await deleteAuth({ id: params.id })
			if (response.code === 200) {
				this.$notification.success({ message: '成功', description: '删除成功' })
				this.authAll()
				return
			}
		} else {
			this.table.loading = true
			const response = await changeAuth({
				id: params.id,
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
		const { getFieldDecorator } = this.form
		return (
			<div class="admin-auth">
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
											<Tag key={k.apply_key} color={(Color as any)[k.apply_key]}>
												{k.apply_name}
											</Tag>
										) : null
									)}
								</div>
							),
							status: (status: number) => (
								<Tag style={{ marginRight: 0 }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: any) => (
								<Actions params={props} onActions={this.handelAction}></Actions>
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

				<Modal
					getContainer={() => document.querySelector('.admin-auth')}
					visible={this.authModal.visible}
					title={this.authModal.title}
					centered={this.authModal.centered}
					width={this.authModal.width}
					okText={this.authModal.okText}
					cancelText={this.authModal.cancelText}
					confirmLoading={this.authModal.loading}
					destroyOnClose={this.authModal.destroyOnClose}
					onCancel={this.authModal.onCancel}
					onOk={this.authModal.onSubmit}
				>
					<Form layout="horizontal">
						<Form.Item
							style={{ display: 'none' }}
							hasFeedback={true}
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('id', {
								initialValue: this.authModal.id,
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
						<Form.Item
							label="唯一标识码"
							hasFeedback={true}
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('auth_key', {
								initialValue: this.authModal.auth_key,
								rules: [{ required: true }],
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
						<Form.Item
							label="权限名称"
							hasFeedback={true}
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('auth_name', {
								initialValue: this.authModal.auth_name,
								rules: [{ required: true, message: '请输入权限名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入权限名称" />)}
						</Form.Item>
						<Form.Item
							label="权限状态"
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('status', {
								initialValue: this.authModal.status,
								validateTrigger: 'change'
							})(
								<Radio.Group>
									<Radio value={1}>开放</Radio>
									<Radio value={0}>禁用</Radio>
								</Radio.Group>
							)}
						</Form.Item>
						<Form.Item
							label="可操作权限"
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('apply', {
								initialValue: this.authModal.apply
									.filter((k: Apply) => k.status)
									.map((k: Apply) => k.apply_key),
								validateTrigger: 'change'
							})(
								<Checkbox.Group>
									{this.authModal.apply.map((k: Apply) => {
										return <Checkbox value={k.apply_key}>{k.apply_name}</Checkbox>
									})}
								</Checkbox.Group>
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(Auth)

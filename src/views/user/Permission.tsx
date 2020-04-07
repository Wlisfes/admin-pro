/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:19:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 00:15:18
 * @Description: 模块权限管理
 */
import './less/permission.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Table, Button, Modal, Input, Select } from 'ant-design-vue'
import { applyAll, createPermission } from '@/api/user'
import { PermissionCereateModalType } from '@/interface/user'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Permission extends Vue {
	private form: any

	//表头
	private columns = [
		{
			title: '唯一识别码',
			dataIndex: 'id'
		},
		{
			title: '权限名称',
			dataIndex: 'name'
		},
		{
			title: '可操作权限',
			dataIndex: 'actions'
			// scopedSlots: { customRender: 'actions' }
		},
		{
			title: '状态',
			dataIndex: 'status',
			scopedSlots: { customRender: 'status' }
		},
		{
			title: '操作',
			width: '150px',
			dataIndex: 'action',
			scopedSlots: { customRender: 'action' }
		}
	]

	//列表数据
	private applys = [
		// {
		// 	id: 'user',
		// 	name: '用户管理',
		// 	actions: '新增',
		// 	status: 'true',
		// 	action: '编辑'
		// }
	]

	private cereateModal: PermissionCereateModalType = {
		title: '新增', //标题
		okText: '确定', //确定按钮文字
		cancelText: '取消', //取消按钮文字
		visible: false, //是否显示弹窗
		centered: true, //是否垂直居中
		width: 800, //弹窗宽度
		destroyOnClose: true, //关闭时销毁弹窗
		createloading: false, //弹窗loading是否加载完毕
		closeloading: false, //弹窗关闭loading
		labelCol: {
			xs: { span: 24 },
			sm: { span: 5 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		},
		onCancel: () => {
			//弹窗关闭回调
			this.cereateModal.visible = false
			this.cereateModal.closeloading = false
			this.cereateModal.createloading = false
		},

		permission: [] //所有操作类型
	}

	//新增模块权限
	async handelCreateModal() {
		this.cereateModal.visible = true

		const response = await applyAll()
		if (response.code === 200) {
			this.cereateModal.permission = response.data
		}
		this.cereateModal.createloading = true
	}

	//弹窗确定回调
	async handelCloseModal() {
		this.cereateModal.closeloading = true
		this.form.validateFields(async (err: any, form: any) => {
			if (err) {
				setTimeout(() => {
					this.cereateModal.closeloading = false
				}, 600)
				return
			}
			const permission = form.permission.map((id: string) => {
				return this.cereateModal.permission.find(v => v.id === id)
			})
			const response = await createPermission({
				permission_id: form.permission_id,
				permission_name: form.permission_name,
				description: form.description,
				disable: Boolean(form.disable),
				permission: permission
			})

			this.cereateModal.onCancel()
		})
	}

	render() {
		const { getFieldDecorator } = this.form

		return (
			<div class="admin-permission">
				<div class="admin-permission-header">
					<Button type="primary" onClick={this.handelCreateModal}>
						新增
					</Button>
				</div>
				<Table
					bordered={true}
					columns={this.columns}
					dataSource={this.applys}
					rowKey={'id'}
					{...{
						scopedSlots: {
							action: (props: any) => {
								console.log(props)
								return (
									<div style={{ color: 'red' }} class="red1">
										{props}
									</div>
								)
							}
						}
					}}
				></Table>

				<Modal
					title={this.cereateModal.title}
					visible={this.cereateModal.visible}
					centered={this.cereateModal.centered}
					width={this.cereateModal.width}
					destroyOnClose={this.cereateModal.destroyOnClose}
					confirmLoading={this.cereateModal.closeloading}
					okText={this.cereateModal.okText}
					cancelText={this.cereateModal.cancelText}
					onCancel={this.cereateModal.onCancel}
					onOk={this.handelCloseModal}
				>
					<Form ref="form" layout="horizontal">
						<Form.Item
							label="权限模块唯一识别码"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission_id', {
								rules: [{ required: true, message: '请输入权限模块唯一识别码' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块唯一识别码" />)}
						</Form.Item>
						<Form.Item
							label="权限模块名称"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission_name', {
								rules: [{ required: true, message: '请输入权限模块名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块名称" />)}
						</Form.Item>
						<Form.Item
							label="状态"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('disable', {
								initialValue: 0,
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(
								<Select>
									<Select.Option value={0}>正常</Select.Option>
									<Select.Option value={1}>禁用</Select.Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item
							label="描述"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(<Input.TextArea placeholder="..." rows={5} />)}
						</Form.Item>
						<Form.Item
							label="赋予权限"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission', {
								initialValue: [],
								validateTrigger: 'change'
							})(
								<Select mode="multiple" loading={!this.cereateModal.createloading}>
									{this.cereateModal.permission.map(k => {
										return (
											<Select.Option key={k.action} value={k.id} disabled={k.disable}>
												{k.name}
											</Select.Option>
										)
									})}
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(Permission)

/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:19:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-06 20:53:28
 * @Description: 模块权限管理
 */
import './less/apply.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Table, Button, Modal, Input, Select } from 'ant-design-vue'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Apply extends Vue {
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

	private modal = {
		title: '新增', //标题
		okText: '确定', //确定按钮文字
		cancelText: '取消', //取消按钮文字
		visible: false, //是否显示弹窗
		centered: true, //是否垂直居中
		width: 800, //弹窗宽度
		destroyOnClose: true, //关闭时销毁弹窗
		createloading: true, //弹窗加载loading
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
			this.modal.visible = false
		}
	}

	//新增模块权限
	async createModal() {
		this.modal.visible = true
	}

	//弹窗确定回调
	async closeModal() {
		this.form.validateFields(async (err: any, form: any) => {
			console.log(form)
		})
	}

	render() {
		const { getFieldDecorator } = this.form

		return (
			<div class="admin-apply">
				<div class="admin-apply-header">
					<Button type="primary" onClick={this.createModal}>
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
					title={this.modal.title}
					visible={this.modal.visible}
					centered={this.modal.centered}
					width={this.modal.width}
					destroyOnClose={this.modal.destroyOnClose}
					okText={this.modal.okText}
					cancelText={this.modal.cancelText}
					onCancel={this.modal.onCancel}
					onOk={this.closeModal}
				>
					<Form ref="form" layout="horizontal">
						<Form.Item
							label="权限模块唯一识别码"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('permission_id', {
								rules: [{ required: true, message: '请输入权限模块唯一识别码' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块唯一识别码" />)}
						</Form.Item>
						<Form.Item
							label="权限模块名称"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('permission_name', {
								rules: [{ required: true, message: '请输入权限模块名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块名称" />)}
						</Form.Item>
						<Form.Item
							label="状态"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('disable', {
								initialValue: 'false',
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(
								<Select>
									<Select.Option value={'false'}>正常</Select.Option>
									<Select.Option value={'true'}>禁用</Select.Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item
							label="描述"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(<Input.TextArea placeholder="..." rows={5} />)}
						</Form.Item>
						<Form.Item
							label="赋予权限"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('permission', {
								initialValue: ['false', 'true'],
								validateTrigger: 'change'
							})(
								<Select mode="multiple">
									<Select.Option value={'false'}>正常</Select.Option>
									<Select.Option value={'true'}>禁用</Select.Option>
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(Apply)

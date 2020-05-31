/*
 * @Author: 情雨随风
 * @Date: 2020-04-25 12:49:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 17:15:21
 * @Description: Role编辑弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { updateRole, getRole } from '@/api/role'

@Component({
	props: { form: { type: Object } }
})
class UpdateRoleModal extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(Number) id!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑角色'
	}
	private role = {
		role_key: '',
		role_name: '',
		status: 0,
		createTime: '',
		loading: true
	}

	created() {
		this.getRole()
	}

	async getRole() {
		const response = await getRole({ id: this.id })
		if (response.code === 200) {
			const data = response.data
			this.role.role_key = data.role_key
			this.role.role_name = data.role_name
			this.role.status = data.status
			this.role.createTime = data.createTime
			this.role.loading = false
		}
	}

	onSubmit() {
		this.modal.loading = true
		this.form.validateFields(
			async (err: any, form: { id: number; role_key: string; role_name: string; status: number }) => {
				if (err) {
					setTimeout(() => {
						this.modal.loading = false
					}, 600)
					return
				}
				const response = await updateRole({
					id: form.id,
					role_key: form.role_key,
					role_name: form.role_name,
					status: form.status
				})

				if (response.code === 200) {
					this.$notification.success({ message: '修改成功', description: '' })
					this.$emit('submit')
				}
				this.modal.loading = false
			}
		)
	}

	onCancel() {
		this.$emit('cancel')
		this.modal.loading = false
	}

	render() {
		const { getFieldDecorator } = this.form
		return (
			<Modal
				getContainer={() => document.querySelector('.admin-role')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				okButtonProps={{ props: { disabled: this.role.loading } }}
				onOk={this.onSubmit}
				onCancel={this.onCancel}
			>
				<Spin size="large" spinning={this.role.loading}>
					<Form layout="horizontal">
						<Form.Item
							style={{ display: 'none' }}
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('id', {
								initialValue: this.id,
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
						<Form.Item
							label="唯一标识码"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('role_key', {
								initialValue: this.role.role_key,
								rules: [{ required: true }],
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
						<Form.Item
							label="角色名称"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('role_name', {
								initialValue: this.role.role_name,
								rules: [{ required: true, message: '请输入角色名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入角色名称" />)}
						</Form.Item>
						<Form.Item label="角色状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
							{getFieldDecorator('status', {
								initialValue: this.role.status,
								validateTrigger: 'change'
							})(
								<Radio.Group>
									<Radio value={1}>开放</Radio>
									<Radio value={0}>禁用</Radio>
								</Radio.Group>
							)}
						</Form.Item>
					</Form>
				</Spin>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false },
		id: { type: Number, default: () => '' }
	}
})(UpdateRoleModal)

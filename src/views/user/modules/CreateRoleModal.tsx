/*
 * @Date: 2020-04-24 15:49:54
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:46:26
 * @Description: Auth新增弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio } from 'ant-design-vue'
import { createRole } from '@/api/role'
import { CommonModal } from '@/interface/common'

@Component({
	props: { form: { type: Object } }
})
class CreateAuthModal extends Vue {
	@Prop(Boolean) visible!: boolean

	private form: any
	private modal = {
		...CommonModal,
		title: '新增权限'
	}

	onSubmit() {
		this.modal.loading = true
		this.form.validateFields(async (err: any, form: { role_key: string; role_name: string; status: number }) => {
			if (err) {
				setTimeout(() => {
					this.modal.loading = false
				}, 600)
				return
			}
			const response = await createRole({
				role_key: form.role_key,
				role_name: form.role_name,
				status: form.status
			})

			if (response.code === 200) {
				this.$notification.success({ message: '添加成功', description: '' })
				this.$emit('submit')
			}
			this.modal.loading = false
		})
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
				onOk={this.onSubmit}
				onCancel={this.onCancel}
			>
				<Form layout="horizontal">
					<Form.Item
						label="唯一标识码"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('role_key', {
							rules: [{ required: true, message: '请输入唯一标识码' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入唯一标识码" />)}
					</Form.Item>
					<Form.Item
						label="角色名称"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('role_name', {
							rules: [{ required: true, message: '请输入角色名称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入角色名称" />)}
					</Form.Item>
					<Form.Item label="角色状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
						{getFieldDecorator('status', {
							initialValue: 1,
							validateTrigger: 'change'
						})(
							<Radio.Group>
								<Radio value={1}>开放</Radio>
								<Radio value={0}>禁用</Radio>
							</Radio.Group>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false }
	}
})(CreateAuthModal)

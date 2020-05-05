/*
 * @Date: 2020-04-24 14:46:09
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:07:52
 * @Description: Auth编辑弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio } from 'ant-design-vue'
import { updateAuth } from '@/api/auth'
import { CommonModal } from '@/interface/common'

interface Apply {
	status: number
	apply_key: string
	apply_name: string
}

@Component({
	props: { form: { type: Object } }
})
class UpdateAuthModal extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(String) id!: string
	@Prop(String) auth_key!: string
	@Prop(String) auth_name!: string
	@Prop(Number) status!: number
	@Prop(Array) apply!: Array<Apply>

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑权限'
	}

	onSubmit() {
		this.modal.loading = true
		this.form.validateFields(async (err: any, form: any) => {
			if (err) {
				setTimeout(() => {
					this.modal.loading = false
				}, 600)
				return
			}
			const apply = this.apply.map((k: Apply) => {
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
				this.$notification.success({ message: '修改成功', description: '' })
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
				getContainer={() => document.querySelector('.admin-auth')}
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
						{getFieldDecorator('auth_key', {
							initialValue: this.auth_key,
							rules: [{ required: true }],
							validateTrigger: 'change'
						})(<Input type="text" disabled />)}
					</Form.Item>
					<Form.Item
						label="权限名称"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('auth_name', {
							initialValue: this.auth_name,
							rules: [{ required: true, message: '请输入权限名称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入权限名称" />)}
					</Form.Item>
					<Form.Item label="权限状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
						{getFieldDecorator('status', {
							initialValue: this.status,
							validateTrigger: 'change'
						})(
							<Radio.Group>
								<Radio value={1}>开放</Radio>
								<Radio value={0}>禁用</Radio>
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="可操作权限" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
						{getFieldDecorator('apply', {
							initialValue: this.apply.filter((k: Apply) => k.status).map((k: Apply) => k.apply_key),
							validateTrigger: 'change'
						})(
							<Checkbox.Group>
								{this.apply.map((k: Apply) => {
									return <Checkbox value={k.apply_key}>{k.apply_name}</Checkbox>
								})}
							</Checkbox.Group>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false },
		id: { type: String, default: () => '' },
		auth_key: { type: String, default: () => '' },
		auth_name: { type: String, default: () => '' },
		status: { type: Number, default: () => 0 },
		apply: { type: Array, default: () => [] }
	}
})(UpdateAuthModal)

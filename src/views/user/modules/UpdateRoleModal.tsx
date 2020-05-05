/*
 * @Author: 情雨随风
 * @Date: 2020-04-25 12:49:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-05 22:00:11
 * @Description: Role编辑弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { AuthInter, updateRole } from '@/api/role'

@Component({
	props: { form: { type: Object } }
})
class UpdateRoleModal extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(String) id!: string
	@Prop(String) role_key!: string
	@Prop(String) role_name!: string
	@Prop([Number, String]) status!: number | string
	@Prop(Array) auth!: Array<AuthInter>

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑角色'
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

			const auth = this.auth.map(k => ({
				...k,
				apply: k.apply.map(v => ({
					...v,
					status: Number(form[k.auth_key].includes(v.apply_key))
				}))
			}))
			const response = await updateRole({
				id: form.id,
				role_key: form.role_key,
				role_name: form.role_name,
				status: form.status,
				auth: auth
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
							initialValue: this.role_key,
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
							initialValue: this.role_name,
							rules: [{ required: true, message: '请输入角色名称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入角色名称" />)}
					</Form.Item>
					<Form.Item label="角色状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
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

					{this.auth.map(k => {
						return (
							<Form.Item
								key={k.auth_key}
								label={k.auth_name}
								labelCol={this.modal.labelCol}
								wrapperCol={this.modal.wrapperCol}
							>
								{getFieldDecorator(k.auth_key, {
									initialValue: k.apply.filter(k => k.status).map(k => k.apply_key),
									validateTrigger: 'change'
								})(
									<Checkbox.Group>
										{k.apply.map(v => (
											<Checkbox key={v.apply_key} value={v.apply_key}>
												{v.apply_name}
											</Checkbox>
										))}
									</Checkbox.Group>
								)}
							</Form.Item>
						)
					})}
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false },
		id: { type: String, default: () => '' },
		role_key: { type: String, default: () => '' },
		role_name: { type: String, default: () => '' },
		status: { type: [Number, String], default: () => 0 },
		auth: { type: Array, default: () => [] }
	}
})(UpdateRoleModal)

/*
 * @Date: 2020-04-24 14:46:09
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:07:52
 * @Description: Auth编辑弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio, Spin } from 'ant-design-vue'
import { updateAuth, roleInfo } from '@/api/auth'
import { CommonModal } from '@/interface/common'

interface Auth {
	auth_key: string
	auth_name: string
	status: number
	loading: boolean
	apply: Array<{
		status: number
		apply_key: string
		apply_name: string
	}>
}

@Component({
	props: { form: { type: Object } }
})
class UpdateAuthModal extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(String) id!: string

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑权限'
	}
	private auth: Auth = {
		auth_key: '',
		auth_name: '',
		status: -1,
		apply: [],
		loading: true
	}

	created() {
		this.roleInfo()
	}

	async roleInfo() {
		const response = await roleInfo({ id: this.id })
		if (response.code === 200) {
			const data = response.data
			this.auth.auth_key = data.auth_key
			this.auth.auth_name = data.auth_name
			this.auth.status = data.status
			this.auth.apply = data.apply
			this.auth.loading = false
		}
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
			const apply = this.auth.apply.map(k => {
				const status = (form.apply as []).some((key: string) => key === k.apply_key)
				return { ...k, status: Number(status) }
			})
			const response = await updateAuth({
				id: form.id,
				auth_key: form.auth_key,
				auth_name: form.auth_name,
				apply: apply,
				status: form.status,
				all: apply.every(k => k.status === 1)
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
				okButtonProps={{ props: { disabled: this.auth.loading } }}
				onOk={this.onSubmit}
				onCancel={this.onCancel}
			>
				<Spin size="large" spinning={this.auth.loading}>
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
								initialValue: this.auth.auth_key,
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
								initialValue: this.auth.auth_name,
								rules: [{ required: true, message: '请输入权限名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入权限名称" />)}
						</Form.Item>
						<Form.Item label="权限状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
							{getFieldDecorator('status', {
								initialValue: this.auth.status,
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
								initialValue: this.auth.apply.filter(k => k.status).map(k => k.apply_key),
								validateTrigger: 'change'
							})(
								<Checkbox.Group>
									{this.auth.apply.map(k => {
										return <Checkbox value={k.apply_key}>{k.apply_name}</Checkbox>
									})}
								</Checkbox.Group>
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
		id: { type: String, default: () => '' },
		auth_key: { type: String, default: () => '' },
		auth_name: { type: String, default: () => '' },
		status: { type: Number, default: () => 0 },
		apply: { type: Array, default: () => [] }
	}
})(UpdateAuthModal)

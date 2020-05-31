/*
 * @Date: 2020-04-24 14:46:09
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:07:52
 * @Description: Auth编辑弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio, Spin } from 'ant-design-vue'
import { updateAuth, getAuth } from '@/api/auth'
import { CommonModal, Apply } from '@/interface/common'
import { AuthType } from '@/interface/user.type'

@Component({
	props: { form: { type: Object } }
})
class UpdateAuthModal extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(Number) id!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑权限'
	}
	private auth = {
		auth_key: '',
		auth_name: '',
		status: 0,
		apply: [],
		loading: true
	}

	created() {
		this.getAuth()
	}

	async getAuth() {
		const response = await getAuth({ id: this.id })
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
		this.form.validateFields(
			async (err: any, form: { auth_key: string; auth_name: string; status: number; apply: string[] }) => {
				if (err) {
					setTimeout(() => {
						this.modal.loading = false
					}, 600)
					return
				}

				console.log(form)
				const apply = Apply.filter(k => form.apply.includes(k.key)).map(k => ({ ...k, status: 1 }))
				// const response = await updateAuth({
				// 	id: form.id,
				// 	auth_key: form.auth_key,
				// 	auth_name: form.auth_name,
				// 	apply: apply,
				// 	status: form.status,
				// 	all: apply.every(k => k.status === 1)
				// })
				// if (response.code === 200) {
				// 	this.$notification.success({ message: '修改成功', description: '' })
				// 	this.$emit('submit')
				// }
				this.modal.loading = false
			}
		)
	}

	onCancel() {
		this.$emit('cancel')
		this.modal.loading = false
	}

	render() {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.form
		const len = ((getFieldValue('apply') as []) || []).filter(k => k).length
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
							<Checkbox
								checked={len === Apply.length}
								indeterminate={!!len && len < Apply.length}
								onClick={(e: any) => {
									setFieldsValue({ apply: e.target.checked ? Apply.map(k => k.key) : [] })
								}}
							>
								全选
							</Checkbox>
							{getFieldDecorator('apply', {
								initialValue: this.auth.apply.map((k: any) => k.key),
								validateTrigger: 'change'
							})(
								<Checkbox.Group>
									{Apply.map(k => {
										return <Checkbox value={k.key}>{k.name}</Checkbox>
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
		id: { type: Number, default: () => '' }
	}
})(UpdateAuthModal)

/*
 * @Author: 情雨随风
 * @Date: 2020-04-28 22:04:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-05 23:38:10
 * @Description: 修改用户信息
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Checkbox } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { updateUser } from '@/api/user'
import { roleAll } from '@/api/role'
import { authAll } from '@/api/auth'

@Component({
	props: { form: { type: Object } }
})
class UpdateUserModal extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(String) id!: string
	@Prop(String) username!: string
	@Prop(String) nickname!: string
	@Prop(String) email!: string
	@Prop([Number, String]) mobile!: string
	@Prop([Number, String]) status!: number | string
	@Prop() roles!: object | null

	private form: any
	private dataRole = []
	private dataAuth = []
	private modal = {
		...CommonModal,
		title: '编辑用户信息'
	}

	//权限合并
	get auth() {
		const auth1 = (this.roles && (this.roles as any).auth) || []
		const auth2 = this.dataAuth

		for (const role in auth1) {
			const index = auth2.findIndex((k: any) => k.auth_key === (role as any).auth_key)

			if (index !== 1) {
				;(auth2[index] as any).status = (role as any).status
			}
		}

		return []
	}

	created() {
		this.roleAll()
		this.authAll()
	}

	async roleAll() {
		const response = await roleAll()
		if (response.code === 200) {
			this.dataRole = response.data
		}
	}

	async authAll() {
		const response = await authAll()
		if (response.code === 200) {
			this.dataAuth = response.data
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
			console.log(form)
			// const response = await updateUser(form)
			// if (response.code === 200) {
			// 	this.$notification.success({ message: '修改成功', description: '' })
			// 	this.$emit('submit')
			// }
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
				getContainer={() => document.querySelector('.admin-user')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
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
						label="用户名"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('username', {
							initialValue: this.username,
							rules: [{ required: true }],
							validateTrigger: 'change'
						})(<Input type="text" disabled />)}
					</Form.Item>
					<Form.Item
						label="昵称"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('nickname', {
							initialValue: this.nickname,
							rules: [{ required: true, message: '请输入昵称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入昵称" />)}
					</Form.Item>
					<Form.Item
						label="邮箱"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('email', {
							initialValue: this.email,
							rules: [
								{ required: Boolean(this.email), message: '请输入邮箱' },
								{
									pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
									message: '格式错误'
								}
							],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入邮箱" />)}
					</Form.Item>
					<Form.Item
						label="手机号"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('mobile', {
							initialValue: this.mobile,
							rules: [
								{ required: Boolean(this.mobile), message: '请输入手机号' },
								{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '格式错误' }
							],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入手机号" />)}
					</Form.Item>
					<Form.Item label="状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
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

					{this.dataRole.length > 0 && (
						<Form.Item label="角色类型" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
							{getFieldDecorator('role_key', {
								initialValue: (this.roles && (this.roles as any).role_key) || '',
								validateTrigger: 'change'
							})(
								<Radio.Group>
									{this.dataRole.map((k: any) => {
										return <Radio value={k.role_key}>{k.role_name}</Radio>
									})}
								</Radio.Group>
							)}
						</Form.Item>
					)}

					{this.dataAuth.length > 0 &&
						this.dataAuth.map((k: any) => {
							return (
								<Form.Item
									style={{ marginBottom: '10px' }}
									key={k.auth_key}
									label={k.auth_name}
									labelCol={this.modal.labelCol}
									wrapperCol={this.modal.wrapperCol}
								>
									{getFieldDecorator(k.auth_key, {
										initialValue: [],
										validateTrigger: 'change'
									})(
										<Checkbox.Group disabled={!Boolean(k.status)}>
											{k.apply.map((v: any) => (
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
		username: { type: String, default: () => '' },
		nickname: { type: String, default: () => '' },
		email: { type: String, default: () => '' },
		mobile: { type: [Number, String], default: () => '' },
		status: { type: [Number, String], default: () => 0 },
		roles: { type: Object, default: () => null }
	}
})(UpdateUserModal)

/*
 * @Author: 情雨随风
 * @Date: 2020-04-28 22:04:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-11 00:22:21
 * @Description: 修改用户信息
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Checkbox, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { updateUser, userInfo } from '@/api/user'
import { roleAll } from '@/api/role'

interface Roles {
	id: string
	status: number
	role_name: string
	role_key: string
	auth: Array<{
		id: string
		all: boolean
		auth_key: string
		auth_name: string
		status: number
		apply: Array<{
			apply_key: string
			apply_name: string
			status: number
		}>
	}>
}
interface User {
	username: string
	nickname: string
	email: string | null
	mobile: string | null
	status: number
	loading: boolean
	roles: Roles
	role: Array<Roles>
}

@Component({
	props: { form: { type: Object } }
})
class UpdateUserModal extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(String) id!: string

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑用户信息'
	}
	private user: User = {
		username: '',
		nickname: '',
		email: '',
		mobile: '',
		status: -1,
		loading: true,
		roles: {
			id: '',
			auth: [],
			status: 0,
			role_name: '',
			role_key: ''
		},
		role: []
	}

	created() {
		this.userInfo()
	}

	//获取用户信息
	async userInfo() {
		const response = await userInfo({ id: this.id })
		const res = await roleAll()
		if (response.code === 200 && res.code === 200) {
			const data = response.data
			this.user.username = data.username
			this.user.nickname = data.nickname
			this.user.email = data.email
			this.user.mobile = data.mobile
			this.user.status = data.status
			this.user.roles = data.roles || this.user.roles

			this.user.role = res.data
			this.user.loading = false
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

			const roles = this.user.role.find(k => k.role_key === form.role_key)
			const auth = roles?.auth.map(k => ({
				...k,
				apply: k.apply.map(v => ({
					...v,
					status: Number(form[k.auth_key].includes(v.apply_key))
				}))
			}))

			const response = await updateUser({
				id: form.id,
				nickname: form.nickname,
				mobile: form.mobile,
				email: form.email,
				status: form.status,
				roles: {
					...roles,
					auth: auth || []
				}
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
		const { getFieldDecorator, getFieldValue } = this.form
		const action = (role_key: string) => getFieldValue('role_key') === role_key

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
				okButtonProps={{ props: { disabled: this.user.loading } }}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			>
				<Spin size="large" spinning={this.user.loading}>
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
								initialValue: this.user.username,
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
								initialValue: this.user.nickname,
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
								initialValue: this.user.email,
								rules: [
									{ required: Boolean(this.user.email), message: '请输入邮箱' },
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
								initialValue: this.user.mobile,
								rules: [
									{ required: Boolean(this.user.mobile), message: '请输入手机号' },
									{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '格式错误' }
								],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入手机号" />)}
						</Form.Item>
						<Form.Item label="状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
							{getFieldDecorator('status', {
								initialValue: this.user.status,
								validateTrigger: 'change'
							})(
								<Radio.Group>
									<Radio value={1}>开放</Radio>
									<Radio value={0}>禁用</Radio>
								</Radio.Group>
							)}
						</Form.Item>

						{this.user.role.length > 0 && (
							<Form.Item
								label="角色类型"
								labelCol={this.modal.labelCol}
								wrapperCol={this.modal.wrapperCol}
							>
								{getFieldDecorator('role_key', {
									initialValue: this.user.roles.role_key,
									validateTrigger: 'change'
								})(
									<Radio.Group>
										{this.user.role.map(k => {
											return (
												<Radio value={k.role_key} disabled={!k.status}>
													{k.role_name}
												</Radio>
											)
										})}
									</Radio.Group>
								)}
							</Form.Item>
						)}

						{this.user.role
							.find(k => action(k.role_key))
							?.auth.map((k, index) => {
								const roles = this.user.roles
								const initialValue = (role_key: string) => {
									try {
										return action(role_key)
											? roles.auth[index].apply.filter(v => v.status).map(v => v.apply_key)
											: k.apply.filter(v => v.status).map(v => v.apply_key)
									} catch (error) {
										return []
									}
								}
								return (
									<Form.Item
										style={{ marginBottom: '10px' }}
										key={k.auth_key}
										label={k.auth_name}
										labelCol={this.modal.labelCol}
										wrapperCol={this.modal.wrapperCol}
									>
										{getFieldDecorator(k.auth_key, {
											initialValue: initialValue(roles.role_key),
											validateTrigger: 'change'
										})(
											<Checkbox.Group disabled={!Boolean(k.status)}>
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
				</Spin>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false },
		id: { type: String, default: () => '' }
	}
})(UpdateUserModal)

/*
 * @Author: 情雨随风
 * @Date: 2020-05-31 15:04:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 15:20:12
 * @Description:
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Spin, Select } from 'ant-design-vue'
import { CommonModal, Apply } from '@/interface/common'
import { getUser } from '@/api/user'
import { roleAll } from '@/api/role'
import { authAll } from '@/api/auth'
import { RoleType, AuthType } from '@/interface/user.type'

interface AuthTypeAll extends AuthType {
	len: number
}
interface UserProp {
	status: number
	roleAll: RoleType[]
	role: RoleType | null
	auth: AuthType[]
	authAll: AuthTypeAll[]
	loading: boolean
}

@Component({
	props: { form: { type: Object } }
})
class UpdateUserAuthModal extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(Number) uid!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑用户权限'
	}
	private user: UserProp = {
		status: 0,
		role: null,
		roleAll: [],
		auth: [],
		authAll: [],
		loading: true
	}

	created() {
		this.getUser()
		this.roleAll()
	}

	//获取用户信息
	async getUser() {
		const response = await getUser({ uid: this.uid })
		const roles = await this.roleAll()
		const auths = await this.authAll()
		if (response.code === 200) {
			const { auth, status } = response.data as { auth: AuthType[] | null; status: number }
			this.user.roleAll = roles
			this.user.authAll = auths.map(k => ({
				...k,
				len: (auth || []).find(u => u.auth_key === k.auth_key)?.apply.length || 0
			}))
			this.user.auth = auth || []
			this.user.status = status
			this.user.loading = false
		}
		console.log(this.user)
	}

	//获取所有角色
	async roleAll(): Promise<RoleType[]> {
		const response = await roleAll()
		if (response.code === 200) {
			return response.data
		}
		return []
	}

	//获取所有权限模块
	async authAll(): Promise<AuthType[]> {
		const response = await authAll()
		if (response.code === 200) {
			return response.data
		}
		return []
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

			// const response = await updateUser({
			// 	uid: form.uid,
			// 	nickname: form.nickname,
			// 	mobile: form.mobile || null,
			// 	email: form.email || null,
			// 	status: form.status
			// })
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
		const { getFieldDecorator, setFieldsValue, getFieldValue } = this.form

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
					<Form layout="horizontal" style={{ height: '500px' }}>
						<Form.Item
							style={{ display: 'none' }}
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('uid', {
								initialValue: this.uid,
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
								initialValue: 1,
								validateTrigger: 'change'
							})(
								<Select placeholder="请选择角色">
									{this.user.roleAll.map(k => (
										<Select.Option value={k.id}>{k.role_name}</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
						{this.user.authAll.map((k, index) => {
							const auth = this.user.auth.find(u => u.auth_key === k.auth_key)
							const applyKey = auth?.apply.map(u => u.key)
							return (
								<Form.Item
									label={k.auth_name}
									labelCol={this.modal.labelCol}
									wrapperCol={this.modal.wrapperCol}
								>
									<Checkbox.Group>
										<Checkbox
											checked={k.len === Apply.length}
											indeterminate={!!k.len && k.len < Apply.length}
											onClick={(e: any) => {
												const apply = e.target.checked ? Apply : []
												setFieldsValue({ [k.auth_key]: apply.map(u => u.key) })
												this.user.authAll[index].len = apply.length
											}}
										>
											全选
										</Checkbox>
									</Checkbox.Group>
									{getFieldDecorator(k.auth_key, {
										initialValue: applyKey,
										validateTrigger: 'change'
									})(
										<Checkbox.Group>
											{Apply.map(v => {
												return (
													<Checkbox
														value={v.key}
														onChange={(e: Event) => {
															setTimeout(() => {
																const apply = (getFieldValue(k.auth_key) as []) || []
																this.user.authAll[index].len = apply.length
																console.log(k.len, Apply.length)
																console.log(apply)
															}, 20)
														}}
													>
														{v.name}
													</Checkbox>
												)
											})}
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
		uid: { type: Number, default: () => '' }
	}
})(UpdateUserAuthModal)

/*
 * @Author: 情雨随风
 * @Date: 2020-05-31 15:04:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 22:29:15
 * @Description:
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Modal, Checkbox, Spin, Select, Radio } from 'ant-design-vue'
import { CommonModal, Apply } from '@/interface/common'
import { getUser, updateUserAuth } from '@/api/user'
import { roleAll, RoleType } from '@/api/role'
import { authAll, AuthType } from '@/api/auth'

interface UserProp {
	status: number
	roleAll: RoleType[]
	role: RoleType | null
	auth: AuthType[]
	authAll: AuthType[]
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
			const { auth, status, role } = response.data as {
				auth: AuthType[] | null
				role: RoleType | null
				status: number
			}
			this.user.roleAll = roles
			this.user.authAll = auths.map(k => {
				const all = (auth && auth.find(u => u.auth_key === k.auth_key)?.all) || 0
				return { ...k, all }
			})
			this.user.role = role
			this.user.auth = auth || []
			this.user.status = status
			this.user.loading = false
		}
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

			const auth = []
			const whits = ['roles', 'status']
			const role = this.user.roleAll.find(k => k.role_key === form.roles) || null //筛选角色
			for (const key in form) {
				if (!whits.includes(key)) {
					const h = this.user.authAll.find(k => k.auth_key === key) || null
					if (h && form[key].length > 0) {
						auth.push({
							...h,
							apply: Apply.filter(k => form[key].includes(k.key)).map(k => ({ ...k, status: 1 }))
						})
					}
				}
			}
			const response = await updateUserAuth({ uid: this.uid, role, auth })
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
					<Form layout="horizontal" style={{ minHeight: '400px' }}>
						<Form.Item
							label="角色"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('roles', {
								initialValue: this.user.role?.role_key || null,
								validateTrigger: 'change'
							})(
								<Select mode="default" placeholder="请选择角色">
									{this.user.roleAll.map(k => (
										<Select.Option disabled={!k.status} value={k.role_key}>
											{k.role_name}
										</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
						{this.user.role && (
							<Form.Item
								label="权限状态"
								labelCol={this.modal.labelCol}
								wrapperCol={this.modal.wrapperCol}
							>
								{getFieldDecorator('status', {
									initialValue: this.user.role.status,
									validateTrigger: 'change'
								})(
									<Radio.Group>
										<Radio value={1}>开放</Radio>
										<Radio value={0}>禁用</Radio>
									</Radio.Group>
								)}
							</Form.Item>
						)}
						{this.user.authAll.map((k, index) => {
							const auth = this.user.auth.find(u => u.auth_key === k.auth_key)
							const applyKey = auth?.apply.map(u => u.key) || []
							return (
								<Form.Item
									label={k.auth_name}
									labelCol={this.modal.labelCol}
									wrapperCol={this.modal.wrapperCol}
								>
									<div class="ant-checkbox-group checkbox-all">
										<Checkbox
											checked={k.all === Apply.length}
											indeterminate={!!k.all && k.all < Apply.length}
											onClick={(e: any) => {
												const apply = e.target.checked ? Apply : []
												setFieldsValue({ [k.auth_key]: apply.map(u => u.key) })
												this.user.authAll[index].all = apply.length
											}}
										>
											全选
										</Checkbox>
									</div>

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
																this.user.authAll[index].all = getFieldValue(
																	k.auth_key
																).length
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

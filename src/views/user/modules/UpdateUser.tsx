/*
 * @Author: 情雨随风
 * @Date: 2020-04-28 22:04:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-10 20:05:28
 * @Description: 修改用户信息
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { updateUser, getUser } from '@/api/user'

@Component({
	props: { form: { type: Object } }
})
class UpdateUser extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(Number) uid!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑用户信息'
	}
	private user = {
		username: '',
		nickname: '',
		email: '',
		mobile: '',
		status: 5,
		loading: true
	}

	protected created() {
		this.getUser()
	}

	//获取用户信息
	public async getUser() {
		const response = await getUser({ uid: this.uid })
		if (response.code === 200) {
			const data = response.data
			this.user.username = data.username
			this.user.nickname = data.nickname
			this.user.email = data.email as string
			this.user.mobile = data.mobile as string
			this.user.status = data.status
			this.user.loading = false
		}
	}

	public onSubmit() {
		this.modal.loading = true
		this.form.validateFields(async (err: any, form: any) => {
			if (err) {
				setTimeout(() => {
					this.modal.loading = false
				}, 600)
				return
			}

			const response = await updateUser({
				uid: form.uid,
				nickname: form.nickname,
				mobile: form.mobile || null,
				email: form.email || null,
				status: form.status
			})
			if (response.code === 200) {
				this.$notification.success({ message: '修改成功', description: '' })
				this.$emit('submit')
			}
			this.modal.loading = false
		})
	}

	public onCancel() {
		this.$emit('cancel')
		this.modal.loading = false
	}

	protected render() {
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
						<Form.Item label="账户状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
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
})(UpdateUser)

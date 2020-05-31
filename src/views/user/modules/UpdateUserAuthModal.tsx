/*
 * @Author: 情雨随风
 * @Date: 2020-05-31 15:04:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 15:20:12
 * @Description:
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Spin } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { getUser } from '@/api/user'

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
	private user = {
		username: '',
		nickname: '',
		email: '',
		mobile: '',
		status: 0,
		loading: true
	}

	created() {
		this.getUser()
	}

	//获取用户信息
	async getUser() {
		const response = await getUser({ uid: this.uid })
		if (response.code === 200) {
			const data = response.data
			// this.user.username = data.username
			// this.user.nickname = data.nickname
			// this.user.email = data.email
			// this.user.mobile = data.mobile
			// this.user.status = data.status
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
					<Form layout="horizontal"></Form>
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

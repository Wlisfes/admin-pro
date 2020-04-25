/*
 * @Date: 2020-04-24 15:49:54
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 16:46:26
 * @Description: Auth新增弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio } from 'ant-design-vue'
import { authAll, AuthInter } from '@/api/auth'
import { createRole, IsRoleInter } from '@/api/role'
import { CommonModal } from '@/interface/common'

@Component({
	props: { form: { type: Object } }
})
class CreateAuthModal extends Vue {
	@Prop(Boolean) visible!: boolean

	private form: any
	private modal = {
		...CommonModal,
		title: '新增权限'
	}
	private auth = {
		dataSource: [],
		loading: true
	}

	created() {
		this.authAll()
	}

	//获取所有权限模块列表
	async authAll() {
		const response = await authAll()
		if (response.code === 200) {
			this.auth.dataSource = response.data
		}
		this.auth.loading = false
	}

	onSubmit() {
		this.modal.loading = true
		this.form.validateFields(async (err: any, form: IsRoleInter) => {
			if (err) {
				setTimeout(() => {
					this.modal.loading = false
				}, 600)
				return
			}
			const auth = this.auth.dataSource.map((k: AuthInter) => {
				const apply = k.apply.map(v => ({ ...v, status: Number(form[k.auth_key].includes(v.apply_key)) }))
				return {
					...k,
					apply,
					all: apply.every(k => k.status)
				}
			})
			const response = await createRole({
				role_key: form.role_key,
				role_name: form.role_name,
				status: form.status,
				auth: auth
			})

			if (response.code === 200) {
				this.$notification.success({ message: '成功', description: '添加成功' })
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
						label="唯一标识码"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('role_key', {
							rules: [{ required: true, message: '请输入唯一标识码' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入唯一标识码" />)}
					</Form.Item>
					<Form.Item
						label="权限名称"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('role_name', {
							rules: [{ required: true, message: '请输入角色名称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入角色名称" />)}
					</Form.Item>
					<Form.Item label="角色状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
						{getFieldDecorator('status', {
							initialValue: 1,
							validateTrigger: 'change'
						})(
							<Radio.Group>
								<Radio value={1}>开放</Radio>
								<Radio value={0}>禁用</Radio>
							</Radio.Group>
						)}
					</Form.Item>
					{this.auth.dataSource.map((k: any) => (
						<Form.Item
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
					))}
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false }
	}
})(CreateAuthModal)

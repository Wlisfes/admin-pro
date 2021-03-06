/*
 * @Date: 2020-04-24 15:49:54
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-02 16:11:58
 * @Description: Auth新增弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio } from 'ant-design-vue'
import { createAuth } from '@/api/auth'
import { CommonModal, Apply } from '@/interface/common'

@Component({
	props: { form: { type: Object } }
})
class CreateAuth extends Vue {
	@Prop(Boolean) visible!: boolean

	private form: any
	private modal = {
		...CommonModal,
		title: '新增权限模块',
		all: 0
	}

	public onSubmit() {
		this.modal.loading = true
		this.form.validateFields(
			async (err: any, form: { auth_key: string; auth_name: string; status: number; apply: string[] }) => {
				if (err) {
					setTimeout(() => {
						this.modal.loading = false
					}, 600)
					return
				}
				const apply = Apply.filter(k => form.apply.includes(k.key)).map(k => ({ ...k, status: 1 }))
				const response = await createAuth({
					auth_key: form.auth_key,
					auth_name: form.auth_name,
					apply: apply,
					status: form.status
				})
				if (response.code === 200) {
					this.$notification.success({ message: '添加成功', description: '' })
					this.$emit('submit')
				}
				this.modal.loading = false
			}
		)
	}

	public onCancel() {
		this.$emit('cancel')
		this.modal.loading = false
	}

	protected render() {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.form
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
						{getFieldDecorator('auth_key', {
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
						{getFieldDecorator('auth_name', {
							rules: [{ required: true, message: '请输入权限名称' }],
							validateTrigger: 'change'
						})(<Input type="text" placeholder="请输入权限名称" />)}
					</Form.Item>
					<Form.Item label="权限状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
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
					<Form.Item label="可操作权限" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
						<div class="ant-checkbox-group checkbox-all">
							<Checkbox
								ref="all"
								checked={this.modal.all == Apply.length}
								indeterminate={!!this.modal.all && this.modal.all < Apply.length}
								onClick={(e: any) => {
									const apply = e.target.checked ? Apply.map(k => k.key) : []
									setFieldsValue({ apply })
									this.modal.all = apply.length
								}}
							>
								全选
							</Checkbox>
						</div>

						{getFieldDecorator('apply', {
							initialValue: [],
							validateTrigger: 'change'
						})(
							<Checkbox.Group>
								{Apply.map(k => {
									return (
										<Checkbox
											value={k.key}
											onClick={() => {
												setTimeout(() => {
													this.modal.all = getFieldValue('apply').length
												}, 20)
											}}
										>
											{k.name}
										</Checkbox>
									)
								})}
							</Checkbox.Group>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false }
	}
})(CreateAuth)

/*
 * @Date: 2020-06-05 09:08:47
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-05 17:19:06
 * @Description: 修改标签
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Spin } from 'ant-design-vue'
import { CommonModal, predefineColor } from '@/interface/common'
import { getTAG, updateTAG } from '@/api/tag'
import B from 'element-ui/lib/button'
import I from 'element-ui/lib/input'
import ColorPicker from 'element-ui/lib/color-picker'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/color-picker.css'

Vue.use(B)
Vue.use(I)
@Component({
	props: { form: { type: Object } },
	components: { ColorPicker }
})
class UpdateTagModal extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(Number) id!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '编辑标签'
	}
	private tag = {
		name: '',
		color: '',
		status: 5,
		loading: true
	}

	protected created() {
		this.getTAG()
	}

	//获取标签信息
	async getTAG() {
		const response = await getTAG({ id: this.id })
		if (response.code === 200) {
			const { name, color, status } = response.data
			this.tag.name = name
			this.tag.color = color
			this.tag.status = status
		}
		this.tag.loading = false
	}

	public onSubmit() {
		this.modal.loading = true
		this.form.validateFields(async (err: any, form: { name: string; color: string; status: number }) => {
			if (err) {
				setTimeout(() => {
					this.modal.loading = false
				}, 600)
				return
			}
			const response = await updateTAG({
				id: this.id,
				name: form.name,
				color: form.color,
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
				getContainer={() => document.querySelector('.root-tag')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				okButtonProps={{ props: { disabled: this.tag.loading } }}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			>
				<Spin size="large" spinning={this.tag.loading}>
					<Form layout="horizontal">
						<Form.Item
							label="标签名称"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('name', {
								initialValue: this.tag.name,
								rules: [{ required: true, message: '请输入标签名称' }],
								validateTrigger: 'change'
							})(<Input type="text" />)}
						</Form.Item>
						<Form.Item
							label="标签颜色"
							class="color-paker"
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('color', {
								initialValue: this.tag.color,
								rules: [{ required: true, message: '请输入标签颜色' }],
								validateTrigger: 'change'
							})(<ColorPicker style={{ width: '100%', height: '40px' }} predefine={predefineColor} />)}
						</Form.Item>
						<Form.Item label="标签状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
							{getFieldDecorator('status', {
								initialValue: this.tag.status,
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
		id: { type: Number, default: () => 0 }
	}
})(UpdateTagModal)

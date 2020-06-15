/*
 * @Author: 情雨随风
 * @Date: 2020-06-15 20:58:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-15 21:18:07
 * @Description: 创建标签
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio } from 'ant-design-vue'
import { CommonModal, predefineColor } from '@/interface/common'
import { createTAG } from '@/api/tag'
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
class CreateTAG extends Vue {
	@Prop(Boolean) visible!: false

	private form: any
	private modal = {
		...CommonModal,
		title: '新增标签'
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

			const response = await createTAG({
				name: form.name,
				color: form.color,
				status: form.status
			})
			if (response.code === 200) {
				this.$notification.success({ message: '新增成功', description: '' })
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
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			>
				<Form layout="horizontal">
					<Form.Item
						label="标签名称"
						hasFeedback={true}
						labelCol={this.modal.labelCol}
						wrapperCol={this.modal.wrapperCol}
					>
						{getFieldDecorator('name', {
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
							rules: [{ required: true, message: '请输入标签颜色' }],
							validateTrigger: 'change'
						})(<ColorPicker style={{ width: '100%', height: '40px' }} predefine={predefineColor} />)}
					</Form.Item>
					<Form.Item label="标签状态" labelCol={this.modal.labelCol} wrapperCol={this.modal.wrapperCol}>
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
				</Form>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean }
	}
})(CreateTAG)

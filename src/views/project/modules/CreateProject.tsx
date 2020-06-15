/*
 * @Author: 情雨随风
 * @Date: 2020-06-09 21:17:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-10 20:00:01
 * @Description: project新增弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Select, Spin, Icon } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { Upload } from '@/components/common'
import { TAGAll } from '@/api/tag'
import { createProject } from '@/api/project'

@Component({
	props: {
		form: { type: Object }
	}
})
class CreateProject extends Vue {
	@Prop(Boolean) visible!: false

	private form: any
	private modal = {
		...CommonModal,
		title: '新增项目'
	}
	private upload = {
		visible: false
	}
	private create = {
		tag: [],
		loading: true,
		picUrl: '',
		visible: false
	}

	protected created() {
		this.TAGAll()
	}

	//获取标签列表
	public async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.create.tag = response.data as []
		}
		this.create.loading = false
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

			const response = await createProject({
				title: form.title,
				description: form.description,
				picUrl: form.picUrl,
				github: form.github,
				tag: form.tag,
				accessUrl: form.accessUrl,
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
		const { getFieldDecorator, setFieldsValue } = this.form
		return (
			<Modal
				getContainer={() => document.querySelector('.root-project')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				okButtonProps={{ props: { disabled: this.create.loading } }}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			>
				<Spin size="large" spinning={this.create.loading}>
					<Form layout="horizontal">
						<Form.Item
							label="项目名称"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('title', {
								rules: [{ required: true, message: '请输入项目名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入项目名称" />)}
						</Form.Item>
						<Form.Item
							label="类别标签"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('tag', {
								rules: [{ required: true, message: '至少选择一个类别' }],
								validateTrigger: 'change'
							})(
								<Select mode="multiple" placeholder="请选择类别">
									{this.create.tag.map((k: any) => (
										<Select.Option value={k.id}>{k.name}</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item
							label="Github"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('github', {
								rules: [{ required: true, message: '请输入项目Github地址' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入项目Github地址" />)}
						</Form.Item>
						<Form.Item
							label="预览地址"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('accessUrl', {
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入项目预览地址" />)}
						</Form.Item>
						<Form.Item
							label="封面"
							hasFeedback={false}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('picUrl', {
								rules: [{ required: true, message: '请上传项目封面' }],
								validateTrigger: 'change'
							})(
								<div>
									<Input type="text" style={{ display: 'none' }} />
									<div class="root-update" onClick={() => (this.upload.visible = true)}>
										{this.create.picUrl ? (
											<img src={this.create.picUrl} />
										) : (
											<Icon type="plus" style={{ color: '#999999', fontSize: '32px' }} />
										)}
									</div>
								</div>
							)}
						</Form.Item>
						<Form.Item
							label="项目状态"
							hasFeedback={false}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
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
						<Form.Item
							label="项目描述"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: '请输入项目描述' }],
								validateTrigger: 'change'
							})(<Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} placeholder="请输入项目描述" />)}
						</Form.Item>
					</Form>
					<Upload
						title="项目封面"
						auto={{ w: 480, h: 270 }}
						visible={this.upload.visible}
						onCancel={() => (this.upload.visible = false)}
						onSubmit={({ response }: { response: { code: number; data: { path: string } } }) => {
							if (response.code === 200) {
								setFieldsValue({ picUrl: response.data.path })
								this.create.picUrl = response.data.path
								this.upload.visible = false
							}
						}}
					/>
				</Spin>
			</Modal>
		)
	}
}

export default Form.create({
	props: {
		visible: { type: Boolean, default: () => false }
	}
})(CreateProject)

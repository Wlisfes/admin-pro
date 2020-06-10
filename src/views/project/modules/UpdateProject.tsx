/*
 * @Author: 情雨随风
 * @Date: 2020-06-10 19:22:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-10 19:56:12
 * @Description: 项目修改弹窗
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Radio, Select, Spin, Icon } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'
import { Upload } from '@/components/common'
import { TAGAll } from '@/api/tag'
import { updateProject, getProject } from '@/api/project'

@Component({
	props: {
		form: { type: Object }
	}
})
class UpdateProject extends Vue {
	@Prop(Boolean) visible!: false
	@Prop(Number) id!: number

	private form: any
	private modal = {
		...CommonModal,
		title: '修改项目'
	}
	private upload = {
		visible: false
	}
	private update = {
		title: '',
		picUrl: '',
		accessUrl: '',
		github: '',
		status: 5,
		description: '',
		tag: [],
		tagAll: [],
		loading: true
	}

	protected created() {
		this.getProject()
	}

	//获取标签列表
	public async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.update.tagAll = response.data as []
		}
		return response
	}

	//获取项目详情
	public async getProject() {
		await this.TAGAll()
		const response = await getProject({ id: this.id })
		if (response.code === 200) {
			const { title, tag, github, accessUrl, picUrl, status, description } = response.data

			this.update.title = title
			this.update.tag = tag.map(k => k.id) as []
			this.update.github = github
			this.update.accessUrl = accessUrl || ''
			this.update.picUrl = picUrl
			this.update.status = status
			this.update.description = description
		}
		this.update.loading = false
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
			const response = await updateProject({
				id: this.id,
				title: form.title,
				description: form.description,
				picUrl: form.picUrl,
				github: form.github,
				tag: form.tag,
				accessUrl: form.accessUrl,
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
				okButtonProps={{ props: { disabled: this.update.loading } }}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			>
				<Spin size="large" spinning={this.update.loading}>
					<Form layout="horizontal">
						<Form.Item
							label="项目名称"
							hasFeedback={true}
							labelCol={this.modal.labelCol}
							wrapperCol={this.modal.wrapperCol}
						>
							{getFieldDecorator('title', {
								initialValue: this.update.title,
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
								initialValue: this.update.tag,
								rules: [{ required: true, message: '至少选择一个类别' }],
								validateTrigger: 'change'
							})(
								<Select mode="multiple" placeholder="请选择类别">
									{this.update.tagAll.map((k: any) => (
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
								initialValue: this.update.github,
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
								initialValue: this.update.accessUrl,
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
								initialValue: this.update.picUrl,
								rules: [{ required: true, message: '请上传项目封面' }],
								validateTrigger: 'change'
							})(
								<div>
									<Input type="text" style={{ display: 'none' }} />
									<div class="root-update" onClick={() => (this.upload.visible = true)}>
										{this.update.picUrl ? (
											<img src={this.update.picUrl} />
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
								initialValue: this.update.status,
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
								initialValue: this.update.description,
								rules: [{ required: true, message: '请输入项目描述' }],
								validateTrigger: 'change'
							})(<Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} placeholder="请输入项目描述" />)}
						</Form.Item>
					</Form>
					<Upload
						title="项目封面"
						auto={{ w: 450, h: 300 }}
						container={{ w: 600, h: 350 }}
						visible={this.upload.visible}
						onCancel={() => (this.upload.visible = false)}
						onSubmit={({ response }: { response: { code: number; data: { path: string } } }) => {
							if (response.code === 200) {
								setFieldsValue({ picUrl: response.data.path })
								this.update.picUrl = response.data.path
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
		visible: { type: Boolean, default: () => false },
		id: { type: Number, default: () => 0 }
	}
})(UpdateProject)

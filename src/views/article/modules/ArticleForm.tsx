/*
 * @Date: 2020-06-15 13:45:28
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-15 15:47:39
 * @Description: 文章头部表单
 */

import '../less/article.form.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Button, Radio, Icon, Select, Spin } from 'ant-design-vue'
import { Upload } from '@/components/common'
import { TAGAll, TAGType } from '@/api/tag'

interface CreateForm {
	title: string | undefined
	tag: any | undefined
	description: string | undefined
	picUrl: string | undefined
	loading: boolean
}

@Component({
	props: {
		form: { type: Object }
	}
})
class ArticleForm extends Vue {
	@Prop() title!: string
	@Prop() tag!: []
	@Prop() description!: string
	@Prop() picUrl!: string
	@Prop() status!: number

	private form: any
	private upload = { visible: false }
	private TAG = { all: [], loading: true }
	private create: CreateForm = {
		title: this.title,
		tag: this.tag,
		description: this.description,
		picUrl: this.picUrl,
		loading: false
	}

	protected created() {
		this.TAGAll()
	}

	protected mounted() {
		this.$emit('ready', this)
	}

	//标签列表
	public async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.TAG.all = response.data as []
		}
		this.TAG.loading = false
	}

	//保存
	public onSubmit() {
		this.create.loading = true
		const timeout = () => (this.create.loading = false)
		this.form.validateFields(async (err: any, form: any) => {
			if (!err) {
				this.$emit('submit', {
					...form,
					tag: form.tag || [],
					timeout
				})
			} else {
				setTimeout(() => timeout(), 600)
			}
		})
	}

	//重置
	public onReply() {
		this.create.title = undefined
		this.create.tag = undefined
		this.create.description = undefined
		this.create.picUrl = undefined
		this.form.resetFields()

		this.$emit('reply')
	}

	protected render() {
		const { getFieldDecorator, setFieldsValue } = this.form
		return (
			<div class="root-article-form">
				<Upload
					title="文章封面"
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
				></Upload>

				<Form layout="inline">
					<div class="form-container">
						<div class="form-item">
							<Form.Item label="文章标题" hasFeedback={true}>
								{getFieldDecorator('title', {
									initialValue: this.create.title,
									rules: [{ required: true, message: '请输入文章名称' }],
									validateTrigger: 'change'
								})(<Input type="text" placeholder="请输入文章名称" />)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="文章类别" hasFeedback={true}>
								{getFieldDecorator('tag', {
									initialValue: this.create.tag,
									rules: [{ required: true, message: '请输至少选择一个类别' }],
									validateTrigger: 'change'
								})(
									<Select mode="multiple" placeholder="请选择类别">
										{this.TAG.loading && (
											<Spin
												slot="notFoundContent"
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding: '24px 0'
												}}
											/>
										)}
										{this.TAG.all.map((k: TAGType) => (
											<Select.Option key={k.id}>{k.name}</Select.Option>
										))}
									</Select>
								)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="文章描述" hasFeedback={true}>
								{getFieldDecorator('description', {
									initialValue: this.create.description,
									rules: [{ required: true, message: '请输入文章描述' }],
									validateTrigger: 'change'
								})(
									<Input.TextArea
										autoSize={{ minRows: 4, maxRows: 6 }}
										placeholder="请输入项目描述"
									/>
								)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="文章封面" hasFeedback={false}>
								{getFieldDecorator('picUrl', {
									initialValue: this.create.picUrl,
									rules: [{ required: true, message: '请上传文章封面' }],
									validateTrigger: 'change'
								})(
									<div>
										<Input type="text" style={{ display: 'none' }} />
										<div class="root-update" onClick={() => (this.upload.visible = true)}>
											{this.create.picUrl ? (
												<div
													class="root-update-picUrl"
													style={{ backgroundImage: `url('${this.create.picUrl}')` }}
												></div>
											) : (
												<Icon type="plus" style={{ color: '#999999', fontSize: '32px' }} />
											)}
										</div>
									</div>
								)}
							</Form.Item>
						</div>
						<div class="form-item" style={{ minHeight: '50px' }}>
							<Form.Item label="文章状态" hasFeedback={false}>
								{getFieldDecorator('status', {
									initialValue: this.status,
									rules: [{ required: true, message: '请选择文章状态' }],
									validateTrigger: 'change'
								})(
									<Radio.Group>
										<Radio value={1}>开放</Radio>
										<Radio value={0}>禁用</Radio>
									</Radio.Group>
								)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Button
								type="primary"
								icon="save"
								loading={this.create.loading}
								disabled={this.create.loading}
								onClick={this.onSubmit}
							>
								保存
							</Button>
							<Button icon="sync" onClick={this.onReply}>
								重置
							</Button>
						</div>
					</div>
				</Form>
			</div>
		)
	}
}

export default Form.create({
	props: {
		title: { type: String },
		tag: { type: Array },
		description: { type: String },
		picUrl: { type: String },
		status: { type: Number }
	}
})(ArticleForm)

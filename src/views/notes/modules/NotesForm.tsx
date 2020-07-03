/*
 * @Date: 2020-06-24 15:58:52
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-24 16:14:18
 * @Description: 笔记头部表单
 */

import '../less/notes.form.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Button, Radio, Icon, Select, Spin } from 'ant-design-vue'
import { Upload } from '@/components/common'
import { TAGAll, TAGType } from '@/api/tag'

@Component({
	props: {
		form: { type: Object }
	}
})
class NotesForm extends Vue {
	@Prop() title!: string
	@Prop() tag!: []
	@Prop() picUrl!: string
	@Prop() status!: number
	@Prop() reply!: string

	private form: any
	private upload = { visible: false }
	private TAG = { all: [], loading: true }
	private create = {
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
		this.form.resetFields()
		this.$emit('reply')
	}

	protected render() {
		const { getFieldDecorator, setFieldsValue, getFieldValue } = this.form
		return (
			<div class="root-notes-form">
				<Upload
					title="文章封面"
					auto={{ w: 480, h: 270 }}
					visible={this.upload.visible}
					onCancel={() => (this.upload.visible = false)}
					onSubmit={({ response }: { response: { code: number; data: { path: string } } }) => {
						if (response.code === 200) {
							setFieldsValue({ picUrl: response.data.path })
							this.upload.visible = false
						}
					}}
				></Upload>
				<Form layout="inline">
					<div class="form-container">
						<div class="form-item">
							<Form.Item label="笔记标题" hasFeedback={true}>
								{getFieldDecorator('title', {
									initialValue: this.title,
									rules: [{ required: true, message: '请输入笔记标题' }],
									validateTrigger: 'change'
								})(<Input type="text" placeholder="请输入笔记标题" />)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="笔记类别" hasFeedback={true}>
								{getFieldDecorator('tag', {
									initialValue: this.tag,
									rules: [{ required: true, message: '请输至少选择一个类别' }],
									validateTrigger: 'change'
								})(
									<Select mode="multiple" placeholder="请选择类别" showArrow>
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
							<Form.Item label="笔记封面" hasFeedback={false}>
								{getFieldDecorator('picUrl', {
									initialValue: this.picUrl,
									rules: [{ required: true, message: '请上传笔记封面' }],
									validateTrigger: 'change'
								})(
									<div>
										<Input type="text" style={{ display: 'none' }} />
										<div class="root-update" onClick={() => (this.upload.visible = true)}>
											{getFieldValue('picUrl') ? (
												<div
													class="root-update-picUrl"
													style={{
														backgroundImage: `url('${getFieldValue('picUrl')}')`
													}}
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
							<Form.Item label="笔记状态" hasFeedback={false}>
								{getFieldDecorator('status', {
									initialValue: this.status,
									rules: [{ required: true, message: '请选择笔记状态' }],
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
							{!this.reply && (
								<Button icon="sync" onClick={this.onReply}>
									重置
								</Button>
							)}
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
		picUrl: { type: String },
		status: { type: Number },
		reply: { type: Boolean }
	}
})(NotesForm)
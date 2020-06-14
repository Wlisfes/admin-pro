/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:28:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-14 23:10:17
 * @Description: 新增文章
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Button, Radio, Icon, Select, Spin } from 'ant-design-vue'
import { Meditor } from '@/components/meditor'
import { TAGAll, TAGType } from '@/api/tag'

@Component({
	props: {
		form: { type: Object }
	}
})
class CreateArticle extends Vue {
	private form: any
	private upload = { visible: false }
	private create = {
		tag: [],
		picUrl: '',
		loading: true
	}
	//编辑器配置
	private meditor: any = {
		self: null,
		props: {
			height: 800,
			toolbars: { clear: true }
		},
		onReady: (e: any) => (this.meditor.self = e.self),
		onUpload: async (e: { self: any; insertContent: Function }) => {
			console.log(e)
		}
	}

	protected created() {
		this.TAGAll()
	}

	//标签列表
	public async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.create.tag = response.data as []
		}
		this.create.loading = false
	}

	//保存
	public onSubmit() {
		this.form.validateFields(async (err: any, form: any) => {
			if (!err) {
				const context = this.meditor.self.handleSave()
				console.log(form, context)
			}
		})
	}

	//重置
	public onReply() {
		this.form.resetFields()
	}

	protected render() {
		const { getFieldDecorator } = this.form
		return (
			<div class="root-article">
				<Form layout="inline">
					<div class="root-article-form">
						<div class="form-item">
							<Form.Item label="文章标题" hasFeedback={true}>
								{getFieldDecorator('title', {
									rules: [{ required: true, message: '请输入文章名称' }],
									validateTrigger: 'change'
								})(<Input type="text" placeholder="请输入文章名称" />)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="文章类别" hasFeedback={true}>
								{getFieldDecorator('tag', {
									rules: [{ required: true, message: '请输至少选择一个类别' }],
									validateTrigger: 'change'
								})(
									<Select mode="multiple" placeholder="请选择类别">
										{this.create.loading && (
											<Spin
												slot="notFoundContent"
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding: '24px 0'
												}}
											/>
										)}
										{this.create.tag.map((k: TAGType) => (
											<Select.Option key={k.id}>{k.name}</Select.Option>
										))}
									</Select>
								)}
							</Form.Item>
						</div>
						<div class="form-item">
							<Form.Item label="文章描述" hasFeedback={true}>
								{getFieldDecorator('description', {
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
									rules: [{ required: true, message: '请上传文章封面' }],
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
						</div>
						<div class="form-item" style={{ minHeight: '50px' }}>
							<Form.Item label="文章状态" hasFeedback={false}>
								{getFieldDecorator('status', {
									initialValue: 1,
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
							<Button type="primary" icon="save" onClick={this.onSubmit}>
								保存
							</Button>
							<Button icon="sync" onClick={this.onReply}>
								重置
							</Button>
						</div>
					</div>
				</Form>

				<Meditor
					class="root-meditor"
					height={800}
					toolbars={{ clear: true }}
					onReady={(e: any) => (this.meditor.self = e.self)}
					onUpload={this.meditor.onUpload}
				></Meditor>
			</div>
		)
	}
}

export default Form.create({})(CreateArticle)

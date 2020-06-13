/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:28:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-13 12:23:36
 * @Description: 新增文章
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Button } from 'ant-design-vue'
import Meditor from 'vue-meditor'

@Component({
	props: {
		form: { type: Object }
	}
})
class CreateArticle extends Vue {
	private form: any

	private types: string = 'month'

	protected render() {
		const { getFieldDecorator, setFieldsValue } = this.form
		return (
			<div class="root-article">
				<Button type={this.types === 'year' ? 'primary' : 'default'} onClick={() => (this.types = 'year')}>
					年
				</Button>
				<Button type={this.types === 'month' ? 'primary' : 'default'} onClick={() => (this.types = 'month')}>
					月
				</Button>

				<Form layout="inline">
					<div class="root-article-form">
						<div class="form-item">
							<Form.Item label="文章标题" hasFeedback={true}>
								{getFieldDecorator('title', {
									rules: [{ required: true, message: '请输入项目名称' }],
									validateTrigger: 'change'
								})(<Input type="text" placeholder="请输入项目名称" />)}
							</Form.Item>
						</div>
						<Form.Item label="项目名称" hasFeedback={true}>
							{getFieldDecorator('title', {
								rules: [{ required: true, message: '请输入项目名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入项目名称" />)}
						</Form.Item>
						<Form.Item label="项目名称" hasFeedback={true}>
							{getFieldDecorator('title', {
								rules: [{ required: true, message: '请输入项目名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入项目名称" />)}
						</Form.Item>
					</div>
				</Form>
				<Meditor id="root-meditor"></Meditor>
			</div>
		)
	}
}

export default Form.create({})(CreateArticle)

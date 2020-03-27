/*
 * @Date: 2020-03-27 13:14:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 14:26:23
 * @Description: 登陆界面
 */

import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Icon, Button, Checkbox } from 'ant-design-vue'
import './index.less'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Login extends Vue {
	private form: any
	private loading: boolean = false
	private remember: boolean = false

	//登陆
	async onSubmit(e: Event) {
		e.preventDefault()
		this.loading = true
		this.form.validateFields(async (err: any, value: { username: string; password: string }) => {
			if (err) {
				setTimeout(() => {
					this.loading = false
				}, 600)
				return
			}
		})
	}

	//记住密码
	onRemember(e: { target: { checked: boolean } }) {
		this.remember = e.target.checked
	}

	render() {
		const { getFieldDecorator } = this.form
		return (
			<div class="login">
				<div class="login-form">
					<h1 style={{ textAlign: 'center' }}>欢迎到来、久违了!</h1>
					<Form onSubmit={this.onSubmit}>
						<Form.Item>
							{getFieldDecorator('username', {
								rules: [{ required: true, message: '请输入帐户名' }],
								validateTrigger: 'change'
							})(
								<Input size="large" type="text" placeholder="username">
									<Icon slot="prefix" type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
								</Input>
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请输入密码' }],
								validateTrigger: 'blur'
							})(
								<Input size="large" type="password" placeholder="password">
									<Icon slot="prefix" type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
								</Input>
							)}
						</Form.Item>
						<Form.Item style={{ marginTop: '24px' }}>
							<Button
								size="large"
								type="primary"
								htmlType="submit"
								style={{ width: '100%' }}
								loading={this.loading}
								disabled={this.loading}
							>
								确定
							</Button>
						</Form.Item>
						<Form.Item>
							<div class="login-footer">
								<Checkbox
									checked={this.remember}
									onChange={(e: { target: { checked: boolean } }) => {
										this.remember = e.target.checked
									}}
								>
									<a style={{ color: '#1890ff' }}>记住密码</a>
								</Checkbox>
								<a
									onClick={() => {
										this.$message.info('忘记了就等死吧！')
									}}
								>
									忘记密码
								</a>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		)
	}
}

export default Form.create({})(Login)

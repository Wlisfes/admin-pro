/*
 * @Date: 2020-03-27 13:14:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-03 16:46:45
 * @Description: 登陆界面
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Form, Input, Icon, Button, Checkbox } from 'ant-design-vue'
import './index.less'

const AppModule = namespace('app')

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Login extends Vue {
	@AppModule.Action('login') login!: Function

	private form: any
	private loading: boolean = false
	private remember: boolean = false

	//登陆
	async onSubmit(e: Event) {
		e.preventDefault()
		this.loading = true
		this.form.validateFields(async (err: any, form: { username: string; password: string }) => {
			if (err) {
				setTimeout(() => {
					this.loading = false
				}, 600)
				return
			}

			const rules = await this.login(form)
			if (rules) {
				this.$notification.success({
					message: '欢迎',
					description: '登陆成功'
				})
				this.$router.push('/')
			} else {
				setTimeout(() => {
					this.loading = false
				}, 600)
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
								<Input size="large" type="text" placeholder="admin">
									<Icon slot="prefix" type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
								</Input>
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请输入密码' }],
								validateTrigger: 'blur'
							})(
								<Input size="large" type="password" placeholder="admin">
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

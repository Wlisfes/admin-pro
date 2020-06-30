/*
 * @Date: 2020-03-27 13:14:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-30 14:59:28
 * @Description: 登陆界面
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Form, Input, Icon, Button, Checkbox, Row, Col } from 'ant-design-vue'

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
	private random: number = Math.random()
	private keep = {
		checked: true,
		username: 'paker',
		password: '123456'
	}

	protected created() {
		this.readStore()
	}

	//读取本地
	private readStore() {
		const form = this.$ls.get('keep')

		if (form) {
			this.keep.checked = form.checked
			this.keep.username = form.username
			this.keep.password = form.password
		}
	}

	//保存账号
	private async saveStore(params: { username: string; password: string }) {
		if (this.keep.checked) {
			this.$ls.set('keep', Object.assign({ checked: true }, params))
		} else {
			this.$ls.remove('keep')
		}
		return true
	}

	//登陆
	public async onSubmit(e: Event) {
		e.preventDefault()
		this.loading = true
		this.form.validateFields(async (err: any, form: any) => {
			if (err) {
				setTimeout(() => {
					this.refCursor()
					this.loading = false
				}, 600)
				return
			}

			const rules = await this.login(form)
			if (rules) {
				await this.saveStore(form)
				this.$notification.success({
					message: '欢迎',
					description: '登陆成功'
				})
				this.$router.push('/')
			} else {
				setTimeout(() => {
					this.refCursor()
					this.loading = false
				}, 600)
			}
		})
	}

	//刷新验证码
	public refCursor() {
		const ref = this.$refs.cursor as any
		ref.src = `${process.env.VUE_APP_BASE_URL}/v2/user/code?time=${Math.random()}`
	}

	//记住密码
	public onRemember(e: { target: { checked: boolean } }) {
		this.keep.checked = e.target.checked
	}

	protected render() {
		const { getFieldDecorator } = this.form
		return (
			<div class="root-main-form">
				<h1 style={{ textAlign: 'center' }}>欢迎到来、久违了!</h1>
				<Form onSubmit={this.onSubmit}>
					<Form.Item>
						{getFieldDecorator('username', {
							initialValue: this.keep.username,
							rules: [{ required: true, message: '请输入帐户名' }],
							validateTrigger: ['blur', 'change']
						})(
							<Input size="large" type="text" placeholder="test">
								<Icon slot="prefix" type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
							</Input>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							initialValue: this.keep.password,
							rules: [
								{ required: true, message: '请输入密码' },
								{ min: 6, message: '密码不能少于6位' }
							],
							validateTrigger: ['blur', 'change']
						})(
							<Input.Password size="large" type="password" placeholder="test">
								<Icon slot="prefix" type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
							</Input.Password>
						)}
					</Form.Item>
					<Row gutter={16}>
						<Col span={16}>
							<Form.Item>
								{getFieldDecorator('code', {
									rules: [
										{ required: true, message: '请输入验证码' },
										{ len: 4, message: '验证码为4位' }
									],
									validateTrigger: ['blur', 'change']
								})(
									<Input size="large" maxLength={4} placeholder="请输入验证码">
										<Icon slot="prefix" type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
									</Input>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<img
								ref="cursor"
								style={{ cursor: 'pointer' }}
								src={`${process.env.VUE_APP_BASE_URL}/v2/user/code?time=${this.random}`}
								onClick={this.refCursor}
							/>
						</Col>
					</Row>
					<Form.Item>
						<Button
							size="large"
							type="primary"
							htmlType="submit"
							style={{ width: '100%' }}
							loading={this.loading}
							disabled={this.loading}
						>
							登录
						</Button>
					</Form.Item>
					<Form.Item>
						<div class="root-main-footer">
							<Checkbox
								checked={this.keep.checked}
								onChange={(e: { target: { checked: boolean } }) => {
									this.keep.checked = e.target.checked
								}}
							>
								<a style={{ color: '#1890ff' }}>记住密码</a>
							</Checkbox>
							<a onClick={() => this.$router.replace('/main/register')}>注册账号</a>
						</div>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

export default Form.create({})(Login)

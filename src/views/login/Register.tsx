/*
 * @Date: 2020-06-29 17:23:12
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-30 14:51:45
 * @Description: 注册界面
 */

import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Icon, Button, Row, Col } from 'ant-design-vue'
import { register } from '@/api/user'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Register extends Vue {
	private form: any
	private random: number = Math.random()
	private loading: boolean = false

	//刷新验证码
	public refCursor() {
		const ref = this.$refs.cursor as any
		ref.src = `/api/v2/user/code?time=${Math.random()}`
	}

	//注册
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

			const response = await register({
				username: form.username,
				nickname: form.nickname,
				password: form.password,
				code: form.code
			})

			if (response.code === 200) {
				this.$notification.success({
					message: '',
					description: '注册成功'
				})
				this.$router.replace('/main/login')
			} else {
				setTimeout(() => {
					this.refCursor()
					this.loading = false
				}, 600)
			}
		})
	}

	protected render() {
		const { getFieldDecorator } = this.form
		return (
			<div class="root-main-form">
				<Form onSubmit={this.onSubmit}>
					<Form.Item>
						{getFieldDecorator('username', {
							rules: [{ required: true, message: '请输入用户名' }],
							validateTrigger: ['blur', 'change']
						})(
							<Input size="large" type="text" placeholder="请输入用户名">
								<Icon slot="prefix" type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
							</Input>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('nickname', {
							rules: [{ required: true, message: '请输入昵称' }],
							validateTrigger: ['blur', 'change']
						})(
							<Input size="large" type="text" placeholder="请输入昵称">
								<Icon slot="prefix" type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
							</Input>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [
								{ required: true, message: '请输入密码' },
								{ min: 6, message: '密码不能少于6位' },
								{ max: 16, message: '密码最多16位' }
							],
							validateTrigger: ['blur', 'change']
						})(
							<Input.Password size="large" maxLength={16} placeholder="请输入密码">
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
							注册
						</Button>
					</Form.Item>
					<Form.Item>
						<div class="root-main-footer">
							<div></div>
							<a onClick={() => this.$router.replace('/main/login')}>登录账号</a>
						</div>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

export default Form.create({})(Register)

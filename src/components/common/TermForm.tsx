/*
 * @Author: 情雨随风
 * @Date: 2020-06-06 11:27:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 13:17:21
 * @Description: 表格查找组件
 */

import './less/common.term.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Select, Button, Badge, Spin } from 'ant-design-vue'
import { allUser, UserType } from '@/api/user'
import moment from 'moment'

interface FormElement {
	replace: boolean
	key: string
	label: string
	render: Function
}
@Component({
	props: { form: { type: Object } }
})
class TermForm extends Vue {
	@Prop() one?: FormElement
	@Prop() two?: FormElement
	@Prop() there?: FormElement
	@Prop() createHide!: boolean
	@Prop() replyHide!: boolean
	@Prop() submitHide!: boolean

	private form: any
	private all: Array<UserType> = []
	private loading: boolean = true

	protected created() {
		!this.one?.replace && this.allUser()
	}

	protected mounted() {
		this.$emit('load', this)
	}

	//所有用户列表
	public async allUser() {
		const response = await allUser()
		if (response.code === 200) {
			this.all = response.data
		}
		this.loading = false
	}

	//则获取全部组件的值
	public getValue() {
		const form = this.form.getFieldsValue()
		const params: any = {}

		for (const key in form) {
			if (form[key] !== undefined) {
				if (key === 'createTime') {
					params[key] = this.createTime(form[key])
				} else {
					params[key] = form[key]
				}
			}
		}
		return params
	}

	//新增
	public onCreate() {
		this.onEmit('create')
	}

	//重置
	public onReply() {
		this.form.resetFields()
		this.onEmit('reply')
	}

	//查询
	public onSubmit() {
		this.form.validateFields(async (err: any, form: any) => {
			const params: any = {}
			for (const key in form) {
				if (form[key] !== undefined) {
					if (key === 'createTime') {
						params[key] = this.createTime(form[key])
					} else {
						params[key] = form[key]
					}
				}
			}
			this.onEmit('submit', params)
		})
	}

	//时间转换
	public createTime(key: number) {
		const startTime = (num: number, key: 'day' | 'month' | 'year') => {
			return moment()
				.subtract(num, key)
				.format('YYYY-MM-DD 00:00:00')
		}
		switch (key) {
			case 1:
				return startTime(0, 'day')
			case 2:
				return startTime(1, 'day')
			case 3:
				return startTime(3, 'day')
			case 4:
				return startTime(7, 'day')
			case 5:
				return startTime(1, 'month')
			case 6:
				return startTime(3, 'month')
			case 7:
				return startTime(1, 'year')
		}
	}

	public onEmit(key: string, data?: object) {
		this.$emit(key, data)
	}

	protected render() {
		const { getFieldDecorator } = this.form
		const styles = { margin: '0 10px 0 0' }
		return (
			<Form layout="inline">
				<div class="common-term">
					<div class="term-item">
						<Form.Item label={this.one?.replace ? this.one.label : '作者'}>
							{getFieldDecorator(this.one?.replace ? this.one.key : 'uid', {
								validateTrigger: 'change'
							})(
								this.one?.replace ? (
									this.one.render()
								) : (
									<Select mode="default" placeholder="请选择">
										{this.loading && (
											<Spin
												slot="notFoundContent"
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding: '24px 0'
												}}
											/>
										)}
										{this.all.map(k => (
											<Select.Option key={k.uid}>{k.nickname}</Select.Option>
										))}
									</Select>
								)
							)}
						</Form.Item>
					</div>
					<div class="term-item">
						<Form.Item label={this.two?.replace ? this.two.label : '状态'}>
							{getFieldDecorator(this.two?.replace ? this.two.key : 'status', {
								validateTrigger: 'change'
							})(
								this.two?.replace ? (
									this.two.render()
								) : (
									<Select mode="default" placeholder="请选择">
										<Select.Option key={1}>
											<Badge color="green" text="已开放" />
										</Select.Option>
										<Select.Option key={0}>
											<Badge color="pink" text="已禁用" />
										</Select.Option>
									</Select>
								)
							)}
						</Form.Item>
					</div>
					<div class="term-item">
						<Form.Item label={this.there?.replace ? this.there.label : '日期'}>
							{getFieldDecorator(this.there?.replace ? this.there.key : 'createTime', {
								validateTrigger: 'change'
							})(
								this.there?.replace ? (
									this.there.render()
								) : (
									<Select mode="default" placeholder="请选择">
										<Select.Option key={1}>今日</Select.Option>
										<Select.Option key={2}>昨日</Select.Option>
										<Select.Option key={3}>前三日</Select.Option>
										<Select.Option key={4}>前一周</Select.Option>
										<Select.Option key={5}>前一月</Select.Option>
										<Select.Option key={6}>前三月</Select.Option>
										<Select.Option key={7}>前一年</Select.Option>
									</Select>
								)
							)}
						</Form.Item>
					</div>
					<div class="term-submit-group">
						{!this.submitHide && (
							<Button type="primary" icon="search" style={styles} onClick={this.onSubmit}>
								查询
							</Button>
						)}
						{!this.createHide && (
							<Button type="primary" icon="plus-circle" style={styles} onClick={this.onCreate}>
								新增
							</Button>
						)}
						{!this.replyHide && (
							<Button icon="sync" onClick={this.onReply}>
								重置
							</Button>
						)}
					</div>
				</div>
			</Form>
		)
	}
}

export default Form.create({
	props: {
		one: { type: Object },
		two: { type: Object },
		there: { type: Object },
		createHide: { type: Boolean },
		replyHide: { type: Boolean },
		submitHide: { type: Boolean }
	}
})(TermForm)

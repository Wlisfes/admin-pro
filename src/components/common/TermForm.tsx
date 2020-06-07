/*
 * @Author: 情雨随风
 * @Date: 2020-06-06 11:27:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-06 14:02:29
 * @Description: 表格查找组件
 */

import './less/common.term.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Select, Button, Badge, Spin } from 'ant-design-vue'
import { allUser, UserType } from '@/api/user'
import moment from 'moment'

@Component({
	props: { form: { type: Object } }
})
class TermForm extends Vue {
	@Prop() htmlForname!: string
	@Prop() htmlFor!: Function

	private form: any
	private all: Array<UserType> = []
	private loading: boolean = true

	protected created() {
		!this.htmlFor && this.allUser()
	}

	//所有用户列表
	public async allUser() {
		const response = await allUser()
		if (response.code === 200) {
			this.all = response.data
		}
		this.loading = false
	}

	public onCreate() {
		this.onEmit('create')
	}

	public onReply() {
		this.form.resetFields()
		this.onEmit('reply')
	}

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

	createTime(key: number) {
		switch (key) {
			case 1:
				return moment().toDate()
				break
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
						<Form.Item label="作者">
							{getFieldDecorator(this.htmlForname || 'uid', {
								validateTrigger: 'change'
							})(
								this.htmlFor ? (
									this.htmlFor()
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
						<Form.Item label="状态">
							{getFieldDecorator('status', {
								validateTrigger: 'change'
							})(
								<Select mode="default" placeholder="请选择">
									<Select.Option key={1}>
										<Badge color="green" text="已开放" />
									</Select.Option>
									<Select.Option key={0}>
										<Badge color="pink" text="已禁用" />
									</Select.Option>
								</Select>
							)}
						</Form.Item>
					</div>
					<div class="term-item">
						<Form.Item label="日期">
							{getFieldDecorator('createTime', {
								validateTrigger: 'change'
							})(
								<Select mode="default" placeholder="请选择">
									<Select.Option key={1}>今日</Select.Option>
									<Select.Option key={2}>昨日</Select.Option>
									<Select.Option key={3}>前三日</Select.Option>
									<Select.Option key={4}>前一周</Select.Option>
									<Select.Option key={5}>前一月</Select.Option>
									<Select.Option key={6}>前三月</Select.Option>
									<Select.Option key={7}>前一年</Select.Option>
								</Select>
							)}
						</Form.Item>
					</div>
					<div class="term-submit-group">
						<Button type="primary" icon="search" style={styles} onClick={this.onSubmit}>
							查询
						</Button>
						<Button type="primary" icon="plus-circle" style={styles} onClick={this.onCreate}>
							新增
						</Button>
						<Button icon="sync" onClick={this.onReply}>
							重置
						</Button>
					</div>
				</div>
			</Form>
		)
	}
}

export default Form.create({
	props: {
		htmlFor: { type: Function }
	}
})(TermForm)

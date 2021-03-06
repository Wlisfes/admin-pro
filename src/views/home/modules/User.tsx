/*
 * @Date: 2020-06-28 14:55:09
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:00:21
 * @Description: 首页用户信息
 */

import '../less/user.less'
import { Vue, Component } from 'vue-property-decorator'
import { Row, Col, Avatar, Icon } from 'ant-design-vue'
import { namespace } from 'vuex-class'
import { AppUser } from '@/store/modules/app/types'
import { AppCount } from '@/api'

const AppModule = namespace('app')

@Component
export default class User extends Vue {
	@AppModule.State(state => state.user) user!: AppUser
	private total = {
		article: 0,
		notes: 0,
		project: 0,
		tag: 0
	}

	private get timeFix() {
		const time = new Date()
		const hour = time.getHours()
		return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
	}

	private get welcome() {
		const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DNF', '我猜你可能累了']
		const index = Math.floor(Math.random() * arr.length)
		return arr[index]
	}

	protected created() {
		this.AppCount()
	}

	//信息统计
	public async AppCount() {
		const response = await AppCount()
		if (response.code === 200) {
			const { article, notes, project, tag } = response.data

			this.total.article = article
			this.total.notes = notes
			this.total.project = project
			this.total.tag = tag
		}
	}

	protected render() {
		return (
			<div class="root-user">
				<Row>
					<Col xl={14} lg={24} md={24} sm={24} xs={24} style={{ display: 'flex', marginBottom: '24px' }}>
						<Avatar
							src={`${this.user.avatar}?x-oss-process=style/resize`}
							size={64}
							style={{ cursor: 'pointer' }}
						/>
						<div class="nicke">
							<div class="nicke-nickname">{`${this.timeFix}，${this.user.nickname}，${this.welcome}`}</div>
							<p>菜鸟前端工程师 | XXXX集团 - 某某某事业群 - VUE平台</p>
						</div>
					</Col>
					<Col xl={10} lg={24} md={24} sm={24} xs={24}>
						<Row class="user-row">
							<Col span={6} style={{ cursor: 'pointer' }}>
								<div class="user-row-label">
									<Avatar
										style={{
											backgroundColor: 'rgba(24, 144, 255, 0.15)',
											color: '#1890ff',
											margin: 0,
											fontSize: '18px'
										}}
										size={34}
										icon="profile"
									/>
									<span>项目</span>
								</div>
								<div class="user-row-number">{this.total.project || '---'}</div>
							</Col>
							<Col span={6} style={{ cursor: 'pointer' }}>
								<div class="user-row-label">
									<Avatar
										style={{
											backgroundColor: 'rgba(250, 84, 28, 0.15)',
											color: '#fa541c',
											margin: 0,
											fontSize: '18px'
										}}
										size={34}
										icon="yuque"
									/>
									<span>标签</span>
								</div>
								<div class="user-row-number">{this.total.tag || '---'}</div>
							</Col>
							<Col span={6} style={{ cursor: 'pointer' }}>
								<div class="user-row-label">
									<Avatar
										style={{
											backgroundColor: 'rgba(19, 194, 194, 0.15)',
											color: '#13c2c2',
											margin: 0,
											fontSize: '18px'
										}}
										size={34}
										icon="read"
									/>
									<span>文章</span>
								</div>
								<div class="user-row-number">{this.total.article || '---'}</div>
							</Col>
							<Col span={6} style={{ cursor: 'pointer' }}>
								<div class="user-row-label">
									<Avatar
										style={{
											backgroundColor: 'rgba(82, 196, 26, 0.15)',
											color: '#52c41a',
											margin: 0,
											fontSize: '18px'
										}}
										size={34}
										icon="schedule"
									/>
									<span>笔记</span>
								</div>
								<div class="user-row-number">{this.total.notes || '---'}</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		)
	}
}

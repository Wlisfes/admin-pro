/*
 * @Date: 2020-06-28 16:58:10
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 15:55:16
 * @Description: 项目卡片
 */

import '../less/chain.pro.less'
import { Vue, Component } from 'vue-property-decorator'
import { Card, Avatar, Badge } from 'ant-design-vue'
import { projectAll, ProjectType } from '@/api/project'

interface ChainProType {
	all: ProjectType[]
	loading: boolean
}

@Component
export default class ChainPro extends Vue {
	private chain: ChainProType = {
		all: [],
		loading: true
	}

	protected created() {
		this.projectAll()
	}

	//项目列表
	public async projectAll() {
		const response = await projectAll()
		if (response.code === 200) {
			this.chain.all = response.data.filter((k, i) => i < 6)
		}
		this.chain.loading = false
	}

	public transform(v: string) {
		let t = v.slice(0, v.indexOf('T'))
		let m = v.slice(v.indexOf('T') + 1, v.indexOf('.'))
		var strtime = `${t} ${m}`
		var date = new Date(strtime.replace(/-/g, '/'))
		var timespan = date.getTime() / 1000
		var dateTime = new Date(timespan * 1000)
		var year = dateTime.getFullYear()
		//当前时间
		var now = Date.parse(new Date() as any)
		var milliseconds = 0
		var timeSpanStr
		//计算时间差
		milliseconds = now / 1000 - timespan

		//一分钟以内
		if (milliseconds <= 60) {
			timeSpanStr = '刚刚'
		}
		//大于一分钟小于一小时
		else if (60 < milliseconds && milliseconds <= 60 * 60) {
			timeSpanStr = Math.ceil(milliseconds / 60) + '分钟前'
		}
		//大于一小时小于等于一天
		else if (60 * 60 < milliseconds && milliseconds <= 60 * 60 * 24) {
			timeSpanStr = Math.ceil(milliseconds / (60 * 60)) + '小时前'
		}
		//大于一天小于等于15天
		else if (60 * 60 * 24 < milliseconds && milliseconds <= 60 * 60 * 24 * 30) {
			timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24)) + '天前'
		}
		//大于一个月小于一年
		else if (60 * 60 * 24 * 30 < milliseconds && milliseconds <= 60 * 60 * 24 * 30 * 12) {
			timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24 * 30)) + '个月前'
		}
		//超过一年显示
		else {
			timeSpanStr = new Date().getFullYear() - year + '年前'
		}
		return timeSpanStr
	}

	protected render() {
		return (
			<Card
				class="root-chain-pro"
				title="项目列表"
				loading={this.chain.loading}
				bordered={false}
				body-style={{ padding: '0' }}
			>
				<div>
					{this.chain.all.map(k => {
						return (
							<Card.Grid key={k.id} style={{ cursor: 'pointer' }}>
								<Card.Meta>
									<div slot="title" class="card-title">
										<Avatar src={`${k.picUrl}?x-oss-process=style/resize`} />
										<a href={k.github} target="_blank">
											{k.title}
										</a>
									</div>
									<div slot="description" class="card-description">
										{k.description}
									</div>
								</Card.Meta>
								<div class="project-item">
									<a href="javascript:;">{k.user.nickname}</a>
									<span class="datetime" style="display: flex;align-items: center;margin-right: 12px">
										<Badge
											status={k.status ? 'success' : 'warning'}
											text={k.status ? '已开放' : '已禁用'}
										></Badge>
									</span>
									<span class="datetime">{this.transform(k.createTime)}</span>
								</div>
							</Card.Grid>
						)
					})}
				</div>
			</Card>
		)
	}
}

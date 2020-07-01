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
import moment from 'moment'

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

	//时间转换
	public transform(createTime: string) {
		return moment(createTime)
			.startOf('ms')
			.fromNow()
	}

	protected render() {
		return (
			<Card class="root-chain-pro" loading={this.chain.loading} bordered={false} body-style={{ padding: '0' }}>
				<div slot="title" style={{ display: 'flex', alignItems: 'center' }}>
					<Avatar
						style={{
							backgroundColor: 'rgba(24, 144, 255, 0.15)',
							color: '#1890ff',
							marginRight: '10px',
							fontSize: '18px'
						}}
						size={34}
						icon="profile"
					/>
					<span>项目列表</span>
				</div>
				<div>
					{this.chain.all.map(k => {
						return (
							<Card.Grid key={k.id} style={{ cursor: 'pointer' }}>
								<Card.Meta>
									<div slot="title" class="card-title">
										<Avatar src={`${k.user.avatar}?x-oss-process=style/resize`} />
										<a href={k.github} target="_blank">
											{k.title}
										</a>
									</div>
									<div slot="description" class="card-description">
										<img src={`${k.picUrl}?x-oss-process=style/resize`} alt="" />
										<div class="description-transform">
											<div>{k.description}</div>
										</div>
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

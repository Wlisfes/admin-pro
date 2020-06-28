/*
 * @Date: 2020-06-28 16:58:10
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-28 17:22:03
 * @Description: 项目卡片
 */

import '../less/chain.pro.less'
import { Vue, Component } from 'vue-property-decorator'
import { Card, Avatar, Badge } from 'ant-design-vue'
import { projectAll, ProjectType } from '@/api/project'

@Component
export default class ChainPro extends Vue {
	private proAll: ProjectType[] = []

	protected created() {
		this.projectAll()
	}

	//项目列表
	public async projectAll() {
		const response = await projectAll()
		if (response.code === 200) {
			this.proAll = response.data
		}
	}

	protected render() {
		return (
			<Card class="root-chain-pro" title="项目列表" bordered={false} body-style={{ padding: '0' }}>
				<div>
					{this.proAll.map(k => {
						return (
							<Card.Grid key={k.id} body-style={{ padding: '0' }}>
								<Card.Meta>
									<div slot="title" class="card-title">
										<Avatar src={k.picUrl} />
										<a href="item.github" target="_blank">
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
										<Badge text={'1111'}></Badge>
									</span>
									<span class="datetime"></span>
								</div>
							</Card.Grid>
						)
					})}
				</div>
			</Card>
		)
	}
}

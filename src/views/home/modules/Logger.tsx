/*
 * @Date: 2020-06-29 14:43:03
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:56:16
 * @Description: 动态日志组件
 */

import '../less/logger.less'
import { Vue, Component } from 'vue-property-decorator'
import { Avatar, Skeleton, Empty, Button, Divider } from 'ant-design-vue'
import { AppLogger, AppLoggerType } from '@/api'
import { namespace } from 'vuex-class'
import { UserType as AppUser } from '@/api/user'

const AppModule = namespace('app')

@Component
export default class Logger extends Vue {
	@AppModule.State(state => state.user) user!: AppUser
	private App = {
		logger: [],
		len: 0,
		limit: 5,
		more: false,
		loading: true
	}

	protected created() {
		this.AppLogger()
	}

	//动态日志列表
	public async AppLogger(params?: any) {
		const response = await AppLogger(params)
		if (response.code === 200) {
			this.App.len = response.data.len
			this.App.logger = this.App.logger.concat(response.data.logger as [])
		}
		this.App.loading = false
		return true
	}

	//加载更多
	public async AppMore() {
		this.App.more = true

		setTimeout(async () => {
			await this.AppLogger({
				limit: this.App.limit,
				offset: this.App.logger.length
			})

			this.App.more = false
		}, 500)
	}

	protected render() {
		return (
			<div class="root-logger">
				<div class="ant-card-head">
					<div class="ant-card-head-wrapper">
						<div class="ant-card-head-title">
							<Avatar
								style={{
									backgroundColor: 'rgba(82, 196, 26, 0.15)',
									color: '#52c41a',
									marginRight: '10px',
									fontSize: '18px'
								}}
								size={34}
								icon="message"
							/>
							<span>动态</span>
						</div>
					</div>
				</div>

				{this.App.loading ? (
					<div style={{ margin: '0 24px' }}>
						<Skeleton active paragraph={{ rows: 4 }} />
						<Skeleton active paragraph={{ rows: 4 }} />
					</div>
				) : this.App.logger.length === 0 ? (
					<div style={{ overflow: 'hidden' }}>
						<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '142px 24px' }} />
					</div>
				) : (
					<div class="logger-container">
						{this.App.logger.map((k: AppLoggerType) => {
							return (
								<div class="logger-item">
									<Avatar
										class="logger-item-avatar"
										size={48}
										src={`${k.user.avatar}?x-oss-process=style/resize`}
									/>
									<div class="logger-item-context">
										<div class="context">
											<span class="logger-user">{k.user.nickname}</span>
											{k.content && <span class="logger-content">{k.content}</span>}
											{k.context && (
												<span class="logger-context" domPropsInnerHTML={`${k.context}`}></span>
											)}
											{k.ipv4 &&
												(this.user?.role?.role_key === 'admin' ||
													this.user?.role?.role_key === 'paker') && (
													<span class="logger-ipv4">
														<span>来源IP: </span>
														<a>{k.ipv4}</a>
													</span>
												)}
										</div>
										<span>{k.createTime}</span>
									</div>
								</div>
							)
						})}

						<div class="logger-more">
							{this.App.len === this.App.logger.length ? (
								<Divider dashed>没有更多了</Divider>
							) : (
								<Button loading={this.App.more} style={{ cursor: 'pointer' }} onClick={this.AppMore}>
									加载更多
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		)
	}
}

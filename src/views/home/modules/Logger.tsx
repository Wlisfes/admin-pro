/*
 * @Date: 2020-06-29 14:43:03
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:56:16
 * @Description: 动态日志组件
 */

import '../less/logger.less'
import { Vue, Component } from 'vue-property-decorator'
import { Avatar, Skeleton } from 'ant-design-vue'
import { AppLogger, AppLoggerType } from '@/api'

@Component
export default class Logger extends Vue {
	private App = {
		logger: [],
		loading: true
	}

	protected created() {
		this.AppLogger()
	}

	//动态日志列表
	public async AppLogger() {
		const response = await AppLogger()
		if (response.code === 200) {
			this.App.logger = response.data as []
		}
		this.App.loading = false
	}

	protected render() {
		const T = (
			<span class="ant-tag ant-tag-has-color" style="background-color: #41b883; cursor: pointer;">
				Vue
			</span>
		)
		const U = (
			<Avatar
				size={48}
				style={{ cursor: 'pointer', margin: '0 24px' }}
				src="https://oss.lisfes.cn/avatar/1592580988216.jpg?x-oss-process=style/resize"
			/>
		)

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
				<div class="logger-container">
					{this.App.logger.map((k: AppLoggerType) => {
						return (
							<div class="logger-item">
								<Avatar
									size={48}
									style={{ cursor: 'pointer', margin: '0 24px' }}
									src={`${k.user.avatar}?x-oss-process=style/resize`}
								/>
								<div class="logger-item-context">
									<div class="context">
										<span class="logger-user">{k.user.nickname}</span>
										{k.content && <span class="logger-content">{k.content}</span>}
										{k.context && (
											<span class="logger-context" domPropsInnerHTML={k.context}></span>
										)}
									</div>
									<span>{k.createTime}</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 23:08:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-05 12:22:54
 * @Description: 文章组件
 */

import './less/article.spin.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Avatar, Tag, Tooltip } from 'ant-design-vue'
import { CommEdit } from '@/components/common'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class ArticleSpin extends Vue {
	@Prop() picUrl!: string
	@Prop() title!: string
	@Prop() description!: string
	@Prop() user!: any
	@Prop() createTime!: string
	@Prop() status!: number
	@Prop() reading!: number
	@Prop() star!: number
	@Prop({ default: () => [] }) tag!: []
	@Prop() params!: any

	protected render() {
		return (
			<div class="article-spin-item">
				<div class="article-spin-item-cursor">
					<div style={{ flex: 1 }}>
						<div class="cursor-user">
							<Avatar class="cursor-user-avatar" src={this.user.avatar} size={40} />
							<div class="cursor-user-nickname">{this.user.nickname}</div>
							<div class="cursor-user-createTime">{moment(this.createTime).format('YYYY-MM-DD')}</div>
							<Tag
								style={{ cursor: 'pointer', margin: '0 0 0 8px' }}
								color={this.status ? 'green' : 'pink'}
							>
								{this.status ? '正常' : '已禁用'}
							</Tag>
						</div>
						<div class="cursor-title">{this.title}</div>
						<div class="cursor-content">{this.description}</div>
					</div>
					<div>
						<img class="cursor-picUrl" src={`${this.picUrl}?x-oss-process=style/resize_50`} alt="" />
					</div>
				</div>
				<div class="article-spin-item-footer">
					<div class="cursor-tags">
						{this.tag.map((x: any) => (
							<Tag key={x.id} color={x.color} style={{ cursor: 'pointer', marginTop: '8px' }}>
								{x.name}
							</Tag>
						))}
					</div>
					<div class="cursor-active">
						<div class="cursor-active-pointer">
							<div class="pointer-icon">
								<Tooltip title={`阅读数：${this.star}`}>
									<div style={{ marginRight: '20px' }}>
										<Avatar
											style={{
												backgroundColor: 'rgba(19, 194, 194, 0.15)',
												color: '#13c2c2',
												marginRight: '8px',
												fontSize: '14px'
											}}
											size={24}
											icon="eye"
										/>
										<a>{this.star}</a>
									</div>
								</Tooltip>
							</div>
							<div class="pointer-icon">
								<Tooltip title={`点赞数：${this.star}`}>
									<div style={{ marginRight: '24px' }}>
										<Avatar
											style={{
												backgroundColor: 'rgba(19, 194, 194, 0.15)',
												color: '#13c2c2',
												marginRight: '8px',
												fontSize: '14px'
											}}
											size={24}
											icon="like"
										/>
										<a>{this.star}</a>
									</div>
								</Tooltip>
							</div>
						</div>
						<CommEdit
							params={{
								props: this.params,
								first: { key: 'update', name: '编辑' },
								last: { key: 'more', name: '更多', more: true },
								menu: [
									{
										key: 'sort',
										name: '置顶',
										icon: 'arrow-up',
										color: Color.import
									},
									{
										key: 'status',
										name: this.status ? '禁用' : '开放',
										icon: this.status ? 'stop' : 'check-circle',
										color: this.status ? Color.warn : Color.ok
									},
									{
										key: 'delete',
										name: '删除',
										icon: 'rest',
										color: Color.delete
									}
								]
							}}
							onChange={(props: any) => this.$emit('change', props)}
						></CommEdit>
					</div>
				</div>
			</div>
		)
	}
}

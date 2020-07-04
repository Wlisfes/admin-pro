/*
 * @Author: 情雨随风
 * @Date: 2020-07-04 11:25:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-04 11:49:02
 * @Description: 笔记组件
 */

import './less/notes.spin.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Avatar, Tag } from 'ant-design-vue'
import { CommEdit } from '@/components/common'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class NotesSpin extends Vue {
	@Prop() picUrl!: string
	@Prop() title!: string
	@Prop() description!: string
	@Prop() user!: any
	@Prop() createTime!: string
	@Prop() status!: number
	@Prop({ default: () => [] }) tag!: []
	@Prop() params!: any

	protected render() {
		return (
			<div class="notes-spin-item">
				<div class="notes-spin-item-cursor">
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
				<div class="notes-spin-item-footer">
					<div class="cursor-tags">
						{this.tag.map((x: any) => (
							<Tag key={x.id} color={x.color} style={{ cursor: 'pointer', marginTop: '8px' }}>
								{x.name}
							</Tag>
						))}
					</div>
					<div class="cursor-active">
						<div class="cursor-active-pointer"></div>
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

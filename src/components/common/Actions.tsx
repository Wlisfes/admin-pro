/*
 * @Author: 情雨随风
 * @Date: 2020-04-08 20:29:26
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 20:42:48
 * @Description: 表格操作部分插槽组件
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Divider, Dropdown, Icon, Menu } from 'ant-design-vue'
import { Color } from '@/interface'

@Component
export default class Actions extends Vue {
	@Prop() params!: any

	handelActionEvent(key: string) {
		this.$emit('actions', {
			key,
			...this.params
		})
	}

	render() {
		const IconStyle = { fontSize: '14px', margin: '0 0 0 4px' }
		return (
			<div>
				<a onClick={() => this.handelActionEvent('update')}>编辑</a>
				<Divider type="vertical"></Divider>
				<Dropdown>
					<a>
						更多
						<Icon type="down" />
					</a>
					<Menu
						slot="overlay"
						onClick={({ key }: { key: string }) => {
							this.handelActionEvent(key)
						}}
					>
						<Menu.Item key="update">
							<span style={{ color: Color.info }}>编辑</span>
							<Icon type="setting" style={{ ...IconStyle, color: Color.info }} />
						</Menu.Item>
						<Menu.Item key={Boolean(this.params.status) ? 'close' : 'open'}>
							<span style={{ color: Boolean(this.params.status) ? Color.warn : Color.ok }}>
								{Boolean(this.params.status) ? '禁用' : '开放'}
							</span>
							<Icon
								type={Boolean(this.params.status) ? 'stop' : 'check-circle'}
								style={{
									...IconStyle,
									color: Boolean(this.params.status) ? Color.warn : Color.ok
								}}
							/>
						</Menu.Item>
						<Menu.Item key="delete">
							<span style={{ color: Color.err }}>删除</span>
							<Icon type="rest" style={{ ...IconStyle, color: Color.err }} />
						</Menu.Item>
					</Menu>
				</Dropdown>
			</div>
		)
	}
}

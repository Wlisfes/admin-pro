/*
 * @Author: 情雨随风
 * @Date: 2020-04-08 20:29:26
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 12:50:27
 * @Description: 表格操作部分插槽组件
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Divider, Dropdown, Icon, Menu } from 'ant-design-vue'

interface CommEditProps {
	props?: any
	first: { key: string; name: string }
	last: {
		key?: string
		more?: boolean
		name: string
	}
	menu: Array<{
		key: string
		name: string
		icon?: string
		color?: string
	}>
}

@Component
export default class CommEdit extends Vue {
	@Prop({
		default: () => ({
			first: { key: 'update', name: '编辑' },
			last: { key: 'more', name: '更多' },
			menu: []
		})
	})
	params!: CommEditProps

	onChange(key: string) {
		this.$emit('change', {
			key,
			props: this.params.props
		})
	}

	render() {
		return (
			<div>
				<a onClick={() => this.onChange(this.params.first.key)}>{this.params.first.name}</a>
				<Divider type="vertical"></Divider>
				<Dropdown>
					<a onClick={() => this.onChange(this.params.last.key || 'more')}>
						<span>更多</span>
						{this.params.last.more && <Icon type="down" style={{ marginLeft: '2px' }} />}
					</a>
					{this.params.menu.length > 0 && (
						<Menu slot="overlay" onClick={({ key }: { key: string }) => this.onChange(key)}>
							{this.params.menu.map(k => (
								<Menu.Item key={k.key}>
									<span style={{ color: k.color || '#1890ff' }}>{k.name}</span>
									{k.icon && (
										<Icon
											type={k.icon}
											style={{
												fontSize: '14px',
												margin: '0 0 0 4px',
												color: k.color || '#1890ff'
											}}
										/>
									)}
								</Menu.Item>
							))}
						</Menu>
					)}
				</Dropdown>
			</div>
		)
	}
}

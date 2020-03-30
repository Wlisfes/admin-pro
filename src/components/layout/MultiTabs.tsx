/*
 * @Date: 2020-03-30 13:37:17
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-30 13:56:04
 * @Description: 多标签页组件
 */

import { Vue, Component } from 'vue-property-decorator'
import { Tabs } from 'ant-design-vue'

@Component
export default class MultiTabs extends Vue {
	private activeKey: string = ''

	render() {
		return (
			<div>
				<Tabs
					v-model={this.activeKey}
					hideAdd={true}
					type="editable-card"
					tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
				>
					{new Array(10).fill(1).map((k, i) => (
						<Tabs.TabPane tab={'刀剑神域'} key={i}></Tabs.TabPane>
					))}
				</Tabs>
			</div>
		)
	}
}

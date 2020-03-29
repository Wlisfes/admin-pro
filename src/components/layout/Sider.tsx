/*
 * @Date: 2020-03-27 15:41:24
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 15:51:35
 * @Description: 侧边栏导航
 */

import { Vue, Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { Layout } from 'ant-design-vue'
import Menu from './Menu'

const AppModule = namespace('app')

@Component
export default class Sider extends Mixins(MixinDevice) {
	@AppModule.State(state => state.siderfixed) siderfixed!: boolean
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.Mutation('SET_COLLAPSED') SET_COLLAPSED!: Function

	//监听视口更改响应式布局
	public handelbreakpoint(point: boolean) {
		this.SET_COLLAPSED(point)
	}

	render() {
		return (
			!this.isMobile() && (
				<Layout.Sider
					class={`${this.siderfixed && 'ant-fixed-sider'}`}
					trigger={null}
					style={{ background: '#fff' }}
					collapsible={true}
					collapsed={this.collapsed}
					width={256}
					breakpoint="lg"
					onBreakpoint={this.handelbreakpoint}
				>
					<Menu></Menu>
				</Layout.Sider>
			)
		)
	}
}

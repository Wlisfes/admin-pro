/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:28:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-29 00:10:46
 * @Description: 头部导航组件
 */

import { Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { Layout, Icon } from 'ant-design-vue'

const AppModule = namespace('app')

@Component
export default class Header extends Mixins(MixinDevice) {
	@AppModule.State(state => state.headerfixed) headerfixed!: boolean
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.Mutation('SET_COLLAPSED') SET_COLLAPSED!: Function

	//手动更改响应式布局
	public handelcollapsed() {
		this.SET_COLLAPSED(!this.collapsed)
	}

	get calcWidth() {
		if (!this.headerfixed || this.isMobile()) {
			return '100%'
		}
		return this.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'
	}

	render() {
		return (
			<Layout.Header
				class={`${this.headerfixed && 'ant-fixed-header'}`}
				style={{ background: '#fff', padding: '0', width: this.calcWidth }}
			>
				<Icon
					class="trigger"
					type={this.collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={this.handelcollapsed}
				/>
			</Layout.Header>
		)
	}
}

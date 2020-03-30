/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:14:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-29 00:01:50
 * @Description: 右侧组件
 */

import { Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Layout } from 'ant-design-vue'
import { MixinDevice } from '@/mixins'
import Header from './Header'

const AppModule = namespace('app')

@Component
export default class Content extends Mixins(MixinDevice) {
	@AppModule.State(state => state.siderfixed) siderfixed!: boolean
	@AppModule.State(state => state.headerfixed) headerfixed!: boolean
	@AppModule.State(state => state.collapsed) collapsed!: boolean

	//计算左外边距
	get calcLayoutMarginLeft() {
		if (!this.siderfixed || this.isMobile()) {
			return '0'
		}
		return this.collapsed ? '80px' : '256px'
	}

	//计算Content全外边距
	get calcContentMargin() {
		if (!this.headerfixed) {
			return this.isMobile() ? '24px 0' : '24px'
		}
		return this.isMobile() ? '90px 0 24px' : '90px 24px 24px'
	}

	render() {
		return (
			<Layout style={{ marginLeft: this.calcLayoutMarginLeft, transition: 'margin 0.2s' }}>
				<Header></Header>
				<Layout.Content style={{ background: '#fff', margin: this.calcContentMargin }}>
					<router-view></router-view>
				</Layout.Content>
			</Layout>
		)
	}
}

/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:14:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-30 21:09:28
 * @Description: 右侧组件
 */

import { Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Layout } from 'ant-design-vue'
import { MixinDevice } from '@/mixins'
import Header from './Header'
import MultiTabs from './MultiTabs'

const AppModule = namespace('app')

@Component
export default class Content extends Mixins(MixinDevice) {
	@AppModule.State(state => state.multiple) multiple!: boolean
	@AppModule.State(state => state.siderfixed) siderfixed!: boolean
	@AppModule.State(state => state.headerfixed) headerfixed!: boolean
	@AppModule.State(state => state.collapsed) collapsed!: boolean

	//计算左外边距
	get layoutMarginLeft() {
		if (!this.siderfixed || this.isMobile()) {
			return '0'
		}
		return this.collapsed ? '80px' : '256px'
	}

	render() {
		return (
			<Layout style={{ marginLeft: this.layoutMarginLeft }}>
				<Header></Header>
				<Layout style={{ marginTop: this.headerfixed ? '64px' : '0' }}>
					{this.multiple && <MultiTabs></MultiTabs>}
					<Layout.Content
						style={{
							margin: this.isMobile() ? '24px 0' : '24px',
							flexDirection: 'column',
							display: 'flex'
						}}
					>
						<router-view></router-view>
					</Layout.Content>
				</Layout>
			</Layout>
		)
	}
}

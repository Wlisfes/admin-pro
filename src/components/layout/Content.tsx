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
	@AppModule.State(state => state.collapsed) collapsed!: boolean

	render() {
		return (
			<Layout>
				<Header></Header>
				<Layout.Content style={{ background: '#fff', margin: this.isMobile() ? '24px 0' : '24px' }}>
					<router-view></router-view>
				</Layout.Content>
			</Layout>
		)
	}
}

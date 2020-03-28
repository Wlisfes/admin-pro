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

const AppModule = namespace('app')

@Component
export default class Sider extends Mixins(MixinDevice) {
	mounted() {}

	public handelbreakpoint(point: any) {
		console.log(point)
	}

	render() {
		return (
			!this.isMobile && (
				<Layout.Sider
					trigger={null}
					width={256}
					breakpoint={'lg'}
					onBreakpoint={this.handelbreakpoint}
				></Layout.Sider>
			)
		)
	}
}

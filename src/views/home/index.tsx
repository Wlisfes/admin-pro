/*
 * @Date: 2020-03-27 12:58:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 13:51:45
 * @Description: 后台首页
 */

import './less/home.less'
import { Mixins, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { User, ChainPro, ChartPro, Logger } from './modules'
import { AppUser } from '@/store/modules/app/types'

const AppModule = namespace('app')

@Component
export default class Home extends Mixins(MixinDevice) {
	@AppModule.State(state => state.user) user!: AppUser

	render() {
		return (
			<div class="root-home" style={{ margin: this.isMobile() ? '0' : '-24px' }}>
				<User></User>
				<div class="container" style={{ margin: this.isMobile() ? '24px 0 0' : '24px' }}>
					<div class="home-container">
						<div class="chain-container">
							<ChainPro></ChainPro>
							<Logger></Logger>
							{/* <div
								domPropsInnerHTML={`<span class="ant-tag ant-tag-has-color" style="background-color: rgb(65, 184, 131); cursor: pointer;">Vue</span>`}
							></div> */}
						</div>
						<div class="chart-container">
							<div class="chart">
								<ChartPro></ChartPro>
							</div>
							<div class="chart"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

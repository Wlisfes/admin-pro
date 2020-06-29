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
import { User, ChainPro, ChartPro } from './modules'
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
					<div class="chain-container">
						<ChainPro></ChainPro>
					</div>
					<div class="chart-container">
						<ChartPro></ChartPro>
					</div>
				</div>
			</div>
		)
	}
}

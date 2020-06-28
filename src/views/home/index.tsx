/*
 * @Date: 2020-03-27 12:58:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-28 17:02:18
 * @Description: 后台首页
 */

import './less/home.less'
import { Mixins, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { User, ChainPro } from './modules'
import { AppUser } from '@/store/modules/app/types'
import { Row, Col } from 'ant-design-vue'

const AppModule = namespace('app')

@Component
export default class Home extends Mixins(MixinDevice) {
	@AppModule.State(state => state.user) user!: AppUser

	render() {
		return (
			<div class="root-home" style={{ margin: this.isMobile() ? '0' : '-24px' }}>
				<User></User>
				<div class="root-home-container" style={{ margin: this.isMobile() ? '24px 0 0' : '24px' }}>
					<Row>
						<Col xl={14} lg={24} md={24} sm={24} xs={24}>
							<ChainPro></ChainPro>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

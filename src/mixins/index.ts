/*
 * @Date: 2020-03-27 15:57:30
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 16:29:11
 * @Description:
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { deviceEnquire, DEVICE_TYPE } from '@/mixins/device'

const AppModule = namespace('app')

//多端监听
@Component
export class MixinDevice extends Vue {
	@AppModule.State(state => state.device) device!: string

	public isMobile() {
		return this.device === DEVICE_TYPE.MOBILE
	}

	public isDesktop() {
		return this.device === DEVICE_TYPE.DESKTOP
	}

	public isTablet() {
		return this.device === DEVICE_TYPE.TABLET
	}
}

//混入App组件  监听视口实现多端显示
@Component
export class AppDeviceEnquire extends Vue {
	@AppModule.Mutation('SET_DEVICE') SET_DEVICE!: Function

	mounted() {
		deviceEnquire(deviceType => {
			switch (deviceType) {
				case DEVICE_TYPE.DESKTOP:
					this.SET_DEVICE(DEVICE_TYPE.DESKTOP)
					break
				case DEVICE_TYPE.TABLET:
					this.SET_DEVICE(DEVICE_TYPE.TABLET)
					break
				case DEVICE_TYPE.MOBILE:
					this.SET_DEVICE(DEVICE_TYPE.MOBILE)
					break
			}
		})
	}
}

@Component
export class AppStore extends Vue {}

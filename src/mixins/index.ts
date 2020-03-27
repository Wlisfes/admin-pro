/*
 * @Date: 2020-03-27 15:57:30
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 16:29:11
 * @Description:
 */

import { Vue, Component } from 'vue-property-decorator'
import { deviceEnquire, DEVICE_TYPE } from '@/mixins/device'

@Component
export class MixinDevice extends Vue {
	public isMobile() {}
}

//混入App组件  监听视口实现多端显示
@Component
export class AppDeviceEnquire extends Vue {
	mounted() {
		deviceEnquire(deviceType => {
			switch (deviceType) {
				case DEVICE_TYPE.DESKTOP:
					console.log(DEVICE_TYPE.DESKTOP)
					break
				case DEVICE_TYPE.TABLET:
					console.log(DEVICE_TYPE.TABLET)
					break
				case DEVICE_TYPE.MOBILE:
					console.log(DEVICE_TYPE.MOBILE)
					break
			}
		})
	}
}

@Component
export class AppStore extends Vue {}

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { deviceEnquire, DEVICE_TYPE } from '@/mixins/device'
import { AppUser as User } from '@/store/modules/app/types'

const AppModule = namespace('app')

//用户数据共享
@Component
export class AppUser extends Vue {
	@AppModule.State(state => state.user) user!: User
}

//多端监听
@Component
export class MixinDevice extends Vue {
	@AppModule.State(state => state.device) device!: string

	public isMobile(): boolean {
		return this.device === DEVICE_TYPE.MOBILE
	}

	public isDesktop(): boolean {
		return this.device === DEVICE_TYPE.DESKTOP
	}

	public isTablet(): boolean {
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

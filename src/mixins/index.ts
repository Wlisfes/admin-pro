import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { deviceEnquire, DEVICE_TYPE } from '@/mixins/device'
import { AppUser as User } from '@/store/modules/app/types'

const AppModule = namespace('app')

//用户数据共享
@Component
export class AppUser extends Vue {
	@AppModule.State(state => state.user) user!: User

	public get isAdmin(): boolean {
		//是否为超级管理员
		return this.user.username === 'admin' && this.user.role.role_key === 'admin'
	}

	public get actionRender() {
		//超级管理员才能显示表格操作部分
		return this.isAdmin
			? ([{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }] as any)
			: []
	}
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

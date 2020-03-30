import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { deviceEnquire, DEVICE_TYPE } from '@/mixins/device'

const AppModule = namespace('app')

@Component
export class AppStore extends Vue {
	@AppModule.State(state => state.noneheader) noneheader!: boolean
	@AppModule.Mutation('SET_SCROLLTOP') SET_SCROLLTOP!: Function

	//获取滚动条高度
	private getScrollTop() {
		var scroll_top = 0
		if (document.documentElement && document.documentElement.scrollTop) {
			scroll_top = document.documentElement.scrollTop
		} else if (document.body) {
			scroll_top = document.body.scrollTop
		}
		return scroll_top
	}

	mounted() {
		this.$nextTick(() => {
			document.addEventListener('scroll', () => {
				this.noneheader && this.SET_SCROLLTOP(this.getScrollTop())
			})
		})
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

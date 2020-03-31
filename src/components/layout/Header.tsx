/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:28:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-30 21:10:35
 * @Description: 头部导航组件
 */

import { Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { Layout, Icon } from 'ant-design-vue'

const AppModule = namespace('app')

@Component
export default class Header extends Mixins(MixinDevice) {
	@AppModule.State(state => state.headerfixed) headerfixed!: boolean
	@AppModule.State(state => state.noneheader) noneheader!: boolean
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.Mutation('SET_COLLAPSED') SET_COLLAPSED!: Function

	private visible: boolean = true
	private oldScrollTop: number = 0
	private ticking: boolean = false

	//动态class
	get className() {
		if (!this.headerfixed || this.isMobile()) {
			return 'create-header-fixed-100'
		}
		return this.collapsed ? 'create-header-fixed-80' : 'create-header-fixed-256'
	}

	mounted() {
		document.addEventListener('scroll', this.handleScroll, { passive: true })
	}

	beforeDestroy() {
		document.body.removeEventListener('scroll', this.handleScroll, true)
	}

	//手动更改响应式布局
	public handelcollapsed() {
		this.SET_COLLAPSED(!this.collapsed)
	}

	//下滑隐藏头部
	public handleScroll() {
		if (!this.noneheader) {
			return
		}
		const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
		if (!this.ticking) {
			this.ticking = true
			requestAnimationFrame(() => {
				if (this.oldScrollTop > scrollTop) {
					this.visible = true
				} else if (scrollTop > 240 && this.visible) {
					this.visible = false
				} else if (scrollTop < 240 && !this.visible) {
					this.visible = true
				}
				this.oldScrollTop = scrollTop
				this.ticking = false
			})
		}
	}

	render() {
		return (
			<transition name="showHeader">
				{this.visible && (
					<div class="create-header">
						<Layout.Header
							class={`${this.headerfixed && 'create-header-fixed'} ${this.className} ${this.headerfixed &&
								'create-header-fixed-transition'}`}
							style={{ background: '#fff', padding: '0' }}
						>
							<Icon
								class="trigger"
								type={this.collapsed ? 'menu-unfold' : 'menu-fold'}
								onClick={this.handelcollapsed}
							/>
						</Layout.Header>
					</div>
				)}
			</transition>
		)
	}
}

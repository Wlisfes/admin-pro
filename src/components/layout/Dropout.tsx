/*
 * @Date: 2020-06-03 16:01:37
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:01:17
 * @Description: 头部user组件
 */

import './less/dropout.less'
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { AppUser } from '@/store/modules/app/types'
import { Dropdown, Avatar, Menu, Divider, Icon } from 'ant-design-vue'
import screenfull from 'screenfull'

const AppModule = namespace('app')

@Component
export default class Dropout extends Vue {
	@AppModule.State(state => state.user) user!: AppUser | null
	@AppModule.Action('logout') logout!: Function

	private isFullscreen: boolean = false

	protected mounted() {
		if (screenfull.isEnabled) {
			screenfull.on('change', this.fullScreenChange)
		}
	}

	protected beforeDestroy() {
		if (screenfull.isEnabled) {
			screenfull.off('change', this.fullScreenChange)
		}
	}

	//全屏切换事件
	public fullScreen() {
		if (screenfull.isEnabled) {
			if (!screenfull.isFullscreen) {
				screenfull.request()
			} else {
				screenfull.toggle()
			}
		}
	}

	//监听全屏切换事件
	public fullScreenChange() {
		if (screenfull.isEnabled) {
			this.isFullscreen = screenfull.isFullscreen
		}
	}

	//头像下拉事件
	public async onMenuClick(params: { key: string }) {
		switch (params.key) {
			case 'logout':
				await this.logout()
				break
			case 'project':
				window.open('https://github.com/Wlisfes/admin-pro')
				break
		}
	}

	render() {
		return (
			<div class="root-user-drop">
				<Icon
					type={this.isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
					class="full"
					onClick={this.fullScreen}
				/>
				<Dropdown>
					<div style={{ cursor: 'pointer', padding: '0 12px' }}>
						{this.user && this.user.avatar ? (
							<Avatar src={`${this.user.avatar}?x-oss-process=style/resize`} />
						) : (
							<Avatar src="user" />
						)}
						<span class="user-name">{this.user?.nickname}</span>
					</div>
					<Menu slot="overlay" onClick={this.onMenuClick}>
						<Menu.Item key="user">
							<Icon type="user" />
							个人中心
						</Menu.Item>
						<Menu.Item key="setting">
							<Icon type="setting" />
							账户设置
						</Menu.Item>
						<Menu.Item key="project">
							<Icon type="project" />
							项目地址
						</Menu.Item>
						<Divider style={{ margin: 0 }} />
						<Menu.Item key="logout">
							<Icon type="logout" />
							退出登陆
						</Menu.Item>
					</Menu>
				</Dropdown>
			</div>
		)
	}
}

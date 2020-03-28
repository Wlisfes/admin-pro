/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:46:11
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-28 21:05:25
 * @Description: 移动界面显示侧边栏菜单
 */

import { Component, Mixins } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { MixinDevice } from '@/mixins'
import { Drawer } from 'ant-design-vue'
import Menu from './Menu'

const AppModule = namespace('app')

@Component
export default class CreateDrawer extends Mixins(MixinDevice) {
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.Mutation('SET_TRIGGER') SET_TRIGGER!: Function
	@AppModule.Mutation('SET_COLLAPSED') SET_COLLAPSED!: Function

	created() {
		this.isMobile() && this.onClose()
	}

	//关闭侧边栏
	public onClose() {
		this.SET_COLLAPSED(!this.collapsed)
	}

	render() {
		return (
			this.isMobile() && (
				<Drawer
					wrapClassName="create-drawer"
					placement="left"
					closable={false}
					visible={!this.collapsed}
					onClose={this.onClose}
				>
					<Menu></Menu>
				</Drawer>
			)
		)
	}
}

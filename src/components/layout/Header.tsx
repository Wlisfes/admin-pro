/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:28:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-28 19:56:36
 * @Description: 头部导航组件
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Layout, Icon } from 'ant-design-vue'

const AppModule = namespace('app')

@Component
export default class Header extends Vue {
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.Mutation('SET_COLLAPSED') SET_COLLAPSED!: Function

	//手动更改响应式布局
	public handelcollapsed() {
		this.SET_COLLAPSED(!this.collapsed)
	}

	render() {
		return (
			<Layout.Header style={{ background: '#fff', padding: '0' }}>
				<Icon
					class="trigger"
					type={this.collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={this.handelcollapsed}
				/>
			</Layout.Header>
		)
	}
}

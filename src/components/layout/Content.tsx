/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 17:14:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-28 17:33:04
 * @Description: 右侧组件
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Layout } from 'ant-design-vue'
import Header from './Header'

const AppModule = namespace('app')

@Component
export default class Content extends Vue {
	@AppModule.State(state => state.collapsed) collapsed!: boolean

	render() {
		return (
			<Layout>
				<Header></Header>
				<Layout.Content></Layout.Content>
			</Layout>
		)
	}
}

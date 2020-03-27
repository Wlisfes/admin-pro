/*
 * @Date: 2020-03-27 15:41:24
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 15:51:35
 * @Description: 侧边栏导航
 */

import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Layout } from 'ant-design-vue'

@Component
export default class Sider extends Mixins() {
	mounted() {}

	render() {
		return <Layout.Sider></Layout.Sider>
	}
}

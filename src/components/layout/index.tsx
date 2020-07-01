/*
 * @Author: 情雨随风
 * @Date: 2020-07-01 10:01:33
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-01 10:02:00
 * @Description: 布局框架
 */

import './less/index.less'
import { Vue, Component } from 'vue-property-decorator'
import { Layout } from 'ant-design-vue'
import Sider from '@/components/layout/Sider'
import Drawer from '@/components/layout/Drawer'
import Content from '@/components/layout/Content'
import Setting from '@/components/layout/Setting'

@Component
export default class Main extends Vue {
	render() {
		return (
			<Layout class="create-layout">
				<Sider></Sider>
				<Drawer></Drawer>
				<Content></Content>
				<Setting></Setting>
			</Layout>
		)
	}
}

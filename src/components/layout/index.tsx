import { Vue, Component } from 'vue-property-decorator'
import { Layout } from 'ant-design-vue'
import Sider from '@/components/layout/Sider'
import Drawer from '@/components/layout/Drawer'
import Content from '@/components/layout/Content'
import Setting from '@/components/layout/Setting'
import '@/components/layout/index.less'

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

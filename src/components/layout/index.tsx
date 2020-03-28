import { Vue, Component } from 'vue-property-decorator'
import { Layout } from 'ant-design-vue'
import Sider from './Sider'
import Drawer from './Drawer'
import Content from './Content'
import './index.less'

@Component
export default class Main extends Vue {
	render() {
		return (
			<Layout class="create-layout">
				<Sider></Sider>
				<Drawer></Drawer>
				<Content></Content>
			</Layout>
		)
	}
}

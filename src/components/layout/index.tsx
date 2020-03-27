import { Vue, Component } from 'vue-property-decorator'
import { Layout } from 'ant-design-vue'
import Sider from './Sider'

@Component
export default class Main extends Vue {
	render() {
		return (
			<Layout>
				<Sider></Sider>
				<Layout>
					<Layout.Header></Layout.Header>
					<Layout.Content>
						<router-view></router-view>
					</Layout.Content>
				</Layout>
			</Layout>
		)
	}
}

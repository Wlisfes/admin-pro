import { Component, Mixins } from 'vue-property-decorator'
import { ConfigProvider, BackTop } from 'ant-design-vue'
import { AppDeviceEnquire } from '@/mixins'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

@Component
export default class App extends Mixins(AppDeviceEnquire) {
	render() {
		return (
			<div id="app" style={{ height: '100%' }}>
				<ConfigProvider locale={zhCN}>
					<router-view></router-view>
				</ConfigProvider>
				<BackTop>
					<div class="ant-back-top-content">
						<div class="ant-back-top-icon"></div>
					</div>
				</BackTop>
			</div>
		)
	}
}

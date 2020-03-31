import { Component, Mixins } from 'vue-property-decorator'
import { AppDeviceEnquire } from '@/mixins'

@Component
export default class App extends Mixins(AppDeviceEnquire) {
	render() {
		return (
			<div id="app" style={{ height: '100%' }}>
				<router-view></router-view>
			</div>
		)
	}
}

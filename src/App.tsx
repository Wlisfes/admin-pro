import { Component, Mixins } from 'vue-property-decorator'
import { AppDeviceEnquire } from '@/mixins'

@Component
export default class App extends Mixins(AppDeviceEnquire) {
	private Styles = {
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	}

	render() {
		return (
			<div id="app" style={this.Styles}>
				<router-view></router-view>
			</div>
		)
	}
}

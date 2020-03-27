import { Vue, Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {
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

import { Vue, Component } from 'vue-property-decorator'
import { Button } from 'ant-design-vue'

@Component
export default class Home extends Vue {
	render() {
		return (
			<div class="home">
				<Button type="primary">click</Button>
			</div>
		)
	}
}

/*
 * @Date: 2020-03-27 12:58:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-30 16:53:13
 * @Description: 后台首页
 */

import { Vue, Component } from 'vue-property-decorator'
import { Button } from 'ant-design-vue'

@Component
export default class Home extends Vue {
	render() {
		return (
			<div class="home">
				{Array(50)
					.fill(1)
					.map((k, i) => (
						<div key={i}>
							<Button>{`Click - ${i + k}`}</Button>
						</div>
					))}
			</div>
		)
	}
}

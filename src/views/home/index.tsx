/*
 * @Date: 2020-03-27 12:58:26
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 15:17:16
 * @Description: 后台首页
 */

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

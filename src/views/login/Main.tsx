/*
 * @Date: 2020-06-30 08:43:57
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-30 08:51:24
 * @Description: 登陆注册
 */

import './less/main.less'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Main extends Vue {
	protected render() {
		return (
			<div class="root-main">
				<router-view></router-view>
			</div>
		)
	}
}

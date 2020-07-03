/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 22:07:30
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 22:09:17
 * @Description: 设置中心
 */

import './less/user.setting.less'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class UserSetting extends Vue {
	protected render() {
		return <div class="root-user-setting"></div>
	}
}

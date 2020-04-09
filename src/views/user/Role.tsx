/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:04:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 19:27:21
 * @Description: 角色管理界面
 */

import './less/role.less'

import { Vue, Component } from 'vue-property-decorator'
import { Upload, Button } from 'ant-design-vue'

@Component
export default class Role extends Vue {
	render() {
		return (
			<div class="admin-role">
				<Button>上传</Button>
			</div>
		)
	}
}

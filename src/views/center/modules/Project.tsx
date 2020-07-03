/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 22:50:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 22:56:04
 * @Description: 用户项目
 */

import { Vue, Component } from 'vue-property-decorator'
import { Spin, Empty } from 'ant-design-vue'

@Component
export default class Project extends Vue {
	protected render() {
		return (
			<Spin style={{ maxWidth: '1400px' }} size="large" spinning={true}>
				<div class="root-user-project">
					<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '64px 24px' }} />
				</div>
			</Spin>
		)
	}
}

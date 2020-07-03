/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 23:57:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-04 00:13:05
 * @Description: 列表加载更多组件
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Button, Divider } from 'ant-design-vue'

@Component
export default class ArticleMore extends Vue {
	@Prop() more!: boolean
	@Prop() loading!: boolean

	private AppMore() {
		this.$emit('more')
	}

	protected render() {
		return (
			<div style={{ padding: '24px 0', display: 'flex', justifyContent: 'center' }}>
				{this.more ? (
					<Divider dashed>没有更多了</Divider>
				) : (
					<Button loading={this.loading} style={{ cursor: 'pointer' }} onClick={this.AppMore}>
						加载更多
					</Button>
				)}
			</div>
		)
	}
}

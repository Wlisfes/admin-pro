/*
 * @Author: 情雨随风
 * @Date: 2020-06-04 20:46:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 21:43:38
 * @Description: 标签列表
 */

import './less/tag.less'
import { Vue, Component } from 'vue-property-decorator'
import { TAGAll } from '@/api/tag'

@Component
export default class Tag extends Vue {
	private TAll: [] = []
	private loading: boolean = true

	protected created() {
		this.TAGAll()
	}

	async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			console.log(response.data)
		}
	}

	render() {
		return <div class="root-tag">Tag</div>
	}
}

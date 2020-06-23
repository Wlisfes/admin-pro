/*
 * @Date: 2020-06-23 17:06:44
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 17:11:01
 * @Description: 新增文章
 */

import './less/notes.less'
import { Vue, Component } from 'vue-property-decorator'
import { Meditor } from '@/components/meditor'

@Component
export default class CreateNotes extends Vue {
	protected render() {
		return <div class="root-notes"></div>
	}
}

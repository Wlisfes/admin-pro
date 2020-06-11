/*
 * @Author: 情雨随风
 * @Date: 2020-06-11 21:28:59
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-11 21:42:41
 * @Description: 新增文章
 */

import './less/article.less'
import { Vue, Component } from 'vue-property-decorator'

@Component
class CreateArticle extends Vue {
	protected render() {
		return <div class="root-article"></div>
	}
}

export default CreateArticle

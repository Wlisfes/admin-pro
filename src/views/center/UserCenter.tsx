/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 17:06:27
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 23:36:17
 * @Description: 个人中心
 */

import './less/user.center.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tabs } from 'ant-design-vue'
import { Article, Project, Notes } from './modules'
import { articleAll, sortArticle, cutoverArticle, deleteArticle, ArticleType } from '@/api/article'
import { namespace } from 'vuex-class'
import { AppUser } from '@/store/modules/app/types'

const AppModule = namespace('app')

@Component
export default class UserCenter extends Vue {
	@AppModule.State(state => state.user) user!: AppUser

	protected render() {
		return (
			<div class="root-user-center">
				<div class="user-cursor">123456</div>
				<div class="user-pointer">
					<Tabs style={{ minHeight: '100%' }}>
						<Tabs.TabPane key="article" tab="文章">
							<Article uid={this.user.uid}></Article>
						</Tabs.TabPane>
						<Tabs.TabPane key="project" tab="项目">
							<Project uid={this.user.uid}></Project>
						</Tabs.TabPane>
						<Tabs.TabPane key="notes" tab="笔记">
							<Notes uid={this.user.uid}></Notes>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		)
	}
}

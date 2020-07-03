/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 22:50:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-04 00:12:31
 * @Description: 用户文章
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Spin, Empty } from 'ant-design-vue'
import { ArticleSpin, ArticleMore } from '@/components/common'
import { articleAll, sortArticle, cutoverArticle, deleteArticle, ArticleType } from '@/api/article'

@Component
export default class Article extends Vue {
	@Prop() uid!: number

	private table = {
		loading: true,
		more: false,
		limit: 10,
		len: 0,
		dataSource: []
	}

	protected created() {
		this.articleAll({ uid: this.uid, limit: 5 })
	}

	//文章列表
	public async articleAll(params?: any) {
		const response = await articleAll(params)
		if (response.code === 200) {
			const { len, article } = response.data
			this.table.len = len
			this.table.dataSource = this.table.dataSource.concat(article as [])
		}
		this.table.loading = false
		return true
	}

	//操作
	public async onChange({ key, props }: { key: string; props: ArticleType }) {
		this.table.loading = true
		const limit = this.table.dataSource.length || 5

		//置顶文章
		if (key === 'sort') {
			const response = await sortArticle({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.articleAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverArticle({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.articleAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}

		//删除文章
		if (key === 'delete') {
			const response = await deleteArticle({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.articleAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}
		this.table.loading = false
	}

	//加载更多
	public async AppMore() {
		this.table.more = true
		await this.articleAll({
			uid: this.uid,
			limit: this.table.limit,
			offset: this.table.dataSource.length
		})
		this.table.more = false
	}

	protected render() {
		return (
			<Spin style={{ maxWidth: '1400px' }} size="large" spinning={this.table.loading}>
				<div class="root-user-article">
					{this.table.dataSource.length === 0 ? (
						<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '64px 24px' }} />
					) : (
						<div class="article">
							{this.table.dataSource.map((props: ArticleType) => (
								<ArticleSpin
									{...{ props: { ...props, params: props } }}
									onChange={this.onChange}
								></ArticleSpin>
							))}
							<ArticleMore
								more={this.table.len === this.table.dataSource.length}
								loading={this.table.more}
								onMore={this.AppMore}
							></ArticleMore>
						</div>
					)}
				</div>
			</Spin>
		)
	}
}

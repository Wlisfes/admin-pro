/*
 * @Author: 情雨随风
 * @Date: 2020-07-03 22:50:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-04 12:03:20
 * @Description: 用户笔记
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Spin, Empty } from 'ant-design-vue'
import { NotesSpin, More } from '@/components/common'
import { notesAll, sortNotes, cutoverNotes, deleteNotes, NotesType } from '@/api/notes'

@Component
export default class Notes extends Vue {
	@Prop() uid!: number

	private table = {
		loading: true,
		more: false,
		limit: 10,
		len: 0,
		dataSource: []
	}

	protected created() {
		this.notesAll({ uid: this.uid, limit: 5 })
	}

	//笔记列表
	public async notesAll(params?: any, merge?: boolean) {
		const response = await notesAll(params)
		if (response.code === 200) {
			const { len, notes } = response.data
			this.table.len = len
			if (merge) {
				this.table.dataSource = this.table.dataSource.concat(notes as [])
			} else {
				this.table.dataSource = notes as []
			}
		}
		this.table.loading = false
		return true
	}

	//操作
	public async onChange({ key, props }: { key: string; props: NotesType }) {
		this.table.loading = true
		const limit = this.table.dataSource.length || 5

		//置顶笔记
		if (key === 'sort') {
			const response = await sortNotes({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.notesAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverNotes({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.notesAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}

		//删除笔记
		if (key === 'delete') {
			const response = await deleteNotes({ id: props.id })
			if (response.code === 200) {
				//刷新列表
				this.notesAll({ uid: this.uid, offset: 0, limit })
				return
			}
		}
		this.table.loading = false
	}

	//加载更多
	public async AppMore() {
		this.table.more = true
		await this.notesAll(
			{
				uid: this.uid,
				limit: this.table.limit,
				offset: this.table.dataSource.length
			},
			true
		)
		this.table.more = false
	}

	protected render() {
		return (
			<Spin style={{ maxWidth: '1400px' }} size="large" spinning={this.table.loading}>
				<div class="root-user-notes">
					{this.table.dataSource.length === 0 ? (
						<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '64px 24px' }} />
					) : (
						<div class="notes">
							{this.table.dataSource.map((props: NotesType) => (
								<NotesSpin
									{...{ props: { ...props, params: props } }}
									onChange={this.onChange}
								></NotesSpin>
							))}
							<More
								more={this.table.len === this.table.dataSource.length}
								loading={this.table.more}
								onMore={this.AppMore}
							></More>
						</div>
					)}
				</div>
			</Spin>
		)
	}
}

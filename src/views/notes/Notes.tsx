/*
 * @Date: 2020-06-23 16:55:22
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-24 16:38:09
 * @Description: 笔记列表
 */

import './less/notes.less'
import { Vue, Component } from 'vue-property-decorator'
import { Spin, Empty } from 'ant-design-vue'
import { NotesSpin, More, TermForm } from '@/components/common'
import { UpdateNotes } from './modules'
import { notesAll, sortNotes, cutoverNotes, deleteNotes, NotesType } from '@/api/notes'
import { TAGAll, TAGType } from '@/api/tag'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class NotesAll extends Vue {
	//表格配置
	private table = {
		loading: true,
		more: false,
		limit: 10,
		len: 0,
		dataSource: []
	}

	//修改文章配置
	private update = {
		id: 0,
		visible: false,
		onCancel: () => (this.update.visible = false),
		onSubmit: () => {
			this.table.loading = true
			this.update.visible = false
			setTimeout(() => this.notesAll(), 300)
		}
	}

	//查询组件配置
	private termForm = {
		self: null,
		onReply: () => {
			this.table.loading = true
			setTimeout(() => this.notesAll(), 300)
		},
		onSubmit: (params: any) => {
			this.table.loading = true
			setTimeout(() => this.notesAll(params), 300)
		}
	}

	protected created() {
		this.notesAll({ limit: 5 })
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
		//获取查询表单数据
		const params = (this.termForm.self as any).getValue()
		const limit = this.table.dataSource.length || 5
		const Refresh = this.notesAll(Object.assign({}, params, { limit, offset: 0 }))

		//更新
		if (key === 'update') {
			this.update.id = props.id
			this.update.visible = true
		}

		//置顶笔记
		if (key === 'sort') {
			const response = await sortNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		//删除笔记
		if (key === 'delete') {
			const response = await deleteNotes({ id: props.id })
			if (response.code === 200) {
				this.notesAll(Object.assign({}, params, { limit, offset: 0 }))
				return
			}
		}

		this.table.loading = false
	}

	//加载更多
	public async AppMore() {
		this.table.more = true

		//获取查询表单数据
		const params = (this.termForm.self as any).getValue()

		//合并查询
		await this.notesAll(
			Object.assign({}, params, {
				limit: this.table.limit,
				offset: this.table.dataSource.length
			}),
			true
		)
		this.table.more = false
	}

	protected render() {
		return (
			<div class="root-notes">
				{this.update.visible && (
					<UpdateNotes
						{...{ props: this.update }}
						onCancel={this.update.onCancel}
						onSubmit={this.update.onSubmit}
					></UpdateNotes>
				)}
				<TermForm
					style={{ margin: '24px 24px 0' }}
					{...{ props: { createHide: true } }}
					onLoad={(self: any) => (this.termForm.self = self)}
					onReply={this.termForm.onReply}
					onSubmit={this.termForm.onSubmit}
				></TermForm>
				<Spin
					size="large"
					spinning={this.table.loading}
					style={{ flex: 1, margin: '12px 0 0', overflow: 'hidden', maxWidth: '1400px' }}
				>
					<div class="spin-notes">
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
			</div>
		)
	}
}

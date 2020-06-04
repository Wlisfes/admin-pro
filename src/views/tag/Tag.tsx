/*
 * @Author: 情雨随风
 * @Date: 2020-06-04 20:46:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 23:27:11
 * @Description: 标签列表
 */

import './less/tag.less'
import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Tooltip } from 'ant-design-vue'
import { TAGAll, TAGType } from '@/api/tag'
import { CommEdit } from '@/components/common'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class TAG extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '标签名称', width: '20%', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
			{ title: '权限作者', dataIndex: 'user', scopedSlots: { customRender: 'user' } },
			{ title: '创建时间', width: '22%', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', width: '16%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	protected created() {
		this.TAGAll()
	}

	//获取所有标签列表
	async TAGAll() {
		const response = await TAGAll()
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	async onChange({ key, props }: { key: string; props: TAGType }) {
		console.log(key, props)
	}

	render() {
		return (
			<div class="root-tag">
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 600 }}
					{...{
						scopedSlots: {
							name: (name: string, props: TAGType) => (
								<Tooltip placement="top" title={name}>
									<Tag color={props.color} style={{ cursor: 'pointer' }}>
										{name}
									</Tag>
								</Tooltip>
							),
							user: (user: any) => (
								<Tooltip placement="top" title={user.nickname}>
									<span style={{ cursor: 'pointer' }}>{user.nickname}</span>
								</Tooltip>
							),
							createTime: (createTime: string) => <div>{moment(createTime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => (
								<Tag style={{ cursor: 'pointer' }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: TAGType) => (
								<CommEdit
									params={{
										props,
										first: { key: 'update', name: '编辑' },
										last: { key: 'more', name: '更多', more: true },
										menu: [
											{
												key: 'status',
												name: props.status ? '禁用' : '开放',
												icon: props.status ? 'stop' : 'check-circle',
												color: props.status ? Color.warn : Color.ok
											},
											{ key: 'delete', name: '删除', icon: 'rest', color: Color.delete }
										]
									}}
									onChange={this.onChange}
								/>
							)
						}
					}}
					pagination={{
						pageSize: this.table.pageSize,
						pageSizeOptions: this.table.pageSizeOptions,
						showSizeChanger: this.table.showSizeChanger,
						current: this.table.current
					}}
					onChange={(ops: any) => {
						this.table.current = ops.current
						this.table.pageSize = ops.pageSize
					}}
				></Table>
			</div>
		)
	}
}

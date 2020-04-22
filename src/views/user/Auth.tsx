/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-22 17:26:32
 * @Description: 模块权限管理
 */

import './less/auth.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Empty, Tag } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { authAll } from '@/api/user'
import { Color } from '@/interface'

@Component
export default class Auth extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{
				title: '唯一识别码',
				dataIndex: 'auth_key'
			},
			{
				title: '权限名称',
				dataIndex: 'auth_name'
			},
			{
				title: '可操作权限',
				dataIndex: 'apply',
				scopedSlots: { customRender: 'apply' }
			},
			{
				title: '状态',
				dataIndex: 'status',
				scopedSlots: { customRender: 'status' }
			},
			{
				title: '操作',
				dataIndex: 'action',
				scopedSlots: { customRender: 'action' }
			}
		],

		//loading动画
		loading: true,

		//列表数据
		dataSource: []
	}

	created() {
		this.authAll()
	}

	mounted() {
		console.log((Empty as any).PRESENTED_IMAGE_SIMPLE)
	}

	//获取所有权限模块列表
	async authAll() {
		const response = await authAll()

		if (response.code === 200) {
			this.table.dataSource = response.data
			console.log(response)
		}
		this.table.loading = false
	}

	//操作
	async handelAction(params: { key: string; id: string }) {
		if (params.key === 'delete') {
		}

		console.log(params)
	}

	render() {
		return (
			<div class="admin-auth">
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					// scroll={{ x: 800 }}
					locale={{
						emptyText: <Empty description="暂无数据" image={(Empty as any).PRESENTED_IMAGE_SIMPLE} />
					}}
					{...{
						scopedSlots: {
							apply: (apply: Array<{ apply_key: string; apply_name: string }>) => (
								<div>
									{apply.map(k => (
										<Tag key={k.apply_key} color={(Color as any)[k.apply_key]}>
											{k.apply_name}
										</Tag>
									))}
								</div>
							),
							status: (status: number) => (
								<Tag style={{ marginRight: 0 }} color={Boolean(status) ? 'green' : 'pink'}>
									{Boolean(status) ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: any) => (
								<Actions params={props} onActions={this.handelAction}></Actions>
							)
						}
					}}
				></Table>
			</div>
		)
	}
}

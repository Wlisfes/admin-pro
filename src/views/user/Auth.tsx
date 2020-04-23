/*
 * @Date: 2020-04-22 14:18:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-23 16:51:17
 * @Description: 模块权限管理
 */

import './less/auth.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Input, Table, Empty, Tag, Modal } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { authAll, createAuth, deleteAuth, changeAuth } from '@/api/auth'
import { Color } from '@/interface'

@Component
class Auth extends Vue {
	private form: any
	//表格配置
	private table = {
		//表头
		columns: [
			{
				title: '唯一识别码',
				width: '13.75%',
				dataIndex: 'auth_key'
			},
			{
				title: '权限名称',
				width: '12.5%',
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
				width: '10%',
				scopedSlots: { customRender: 'status' }
			},
			{
				title: '操作',
				dataIndex: 'action',
				width: 130,
				scopedSlots: { customRender: 'action' }
			}
		],

		//loading动画
		loading: true,

		//列表数据
		dataSource: [],

		//分页配置
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 2
	}

	private authModal = {
		visible: false,
		title: '编辑用户',
		okText: '确定',
		cancelText: '取消',
		centered: true,
		width: 800,
		destroyOnClose: true,
		labelCol: {
			xs: { span: 24 },
			sm: { span: 5 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		},
		onCancel: () => {
			this.authModal.visible = false
		}
	}

	created() {
		this.authAll()
	}

	//获取所有权限模块列表
	async authAll() {
		const response = await authAll()
		if (response.code === 200) {
			this.table.dataSource = response.data
		}
		this.table.loading = false
	}

	//操作
	async handelAction(params: { key: string; id: string }) {
		if (params.key === 'update') {
			this.authModal.visible = true
		} else if (params.key === 'delete') {
			this.table.loading = true
			const response = await deleteAuth({ id: params.id })
			if (response.code === 200) {
				this.$notification.success({ message: '成功', description: '删除成功' })
				this.authAll()
				return
			}
		} else {
			this.table.loading = true
			const response = await changeAuth({
				id: params.id,
				status: params.key === 'open' ? 1 : 0
			})
			if (response.code === 200) {
				this.authAll()
				return
			}
		}
		this.table.loading = false
	}

	render() {
		const { getFieldDecorator } = this.form
		return (
			<div class="admin-auth">
				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 800 }}
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
								<Tag style={{ marginRight: 0 }} color={status ? 'green' : 'pink'}>
									{status ? '正常' : '已禁用'}
								</Tag>
							),
							action: (action: any, props: any) => (
								<Actions params={props} onActions={this.handelAction}></Actions>
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

				<Modal
					visible={this.authModal.visible}
					title={this.authModal.title}
					centered={this.authModal.centered}
					width={this.authModal.width}
					okText={this.authModal.okText}
					cancelText={this.authModal.cancelText}
					// confirmLoading={this.authModal.loading}
					destroyOnClose={this.authModal.destroyOnClose}
					onCancel={this.authModal.onCancel}
				>
					<Form layout="horizontal">
						<Form.Item
							style={{ display: 'none' }}
							hasFeedback={true}
							labelCol={this.authModal.labelCol}
							wrapperCol={this.authModal.wrapperCol}
						>
							{getFieldDecorator('id', {
								// initialValue: this.authModal.id,
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(Auth)

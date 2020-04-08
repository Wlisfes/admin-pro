/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:19:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 00:15:18
 * @Description: 模块权限管理
 */
import './less/permission.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Table, Button, Modal, Input, Select, Tag, Dropdown, Tooltip, Divider, Icon, Menu } from 'ant-design-vue'
import { applyAll, createPermission, permissionAll } from '@/api/user'
import { PermissionCereateModalType } from '@/interface/user'
import { Color } from '@/interface'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class Permission extends Vue {
	private form: any

	//表格配置
	private table = {
		//表头
		columns: [
			{
				title: '唯一识别码',
				dataIndex: 'permission_id',
				align: 'center',
				width: 140
			},
			{
				title: '权限名称',
				dataIndex: 'permission_name',
				align: 'center',
				width: 140
			},
			{
				title: '权限描述',
				dataIndex: 'description',
				width: 240,
				scopedSlots: { customRender: 'description' }
			},
			{
				title: '可操作权限',
				dataIndex: 'permission',
				scopedSlots: { customRender: 'permission' }
			},
			{
				title: '状态',
				dataIndex: 'disable',
				align: 'center',
				width: 100,
				scopedSlots: { customRender: 'disable' }
			},
			{
				title: '操作',
				width: 140,
				dataIndex: 'action',
				align: 'center',
				scopedSlots: { customRender: 'action' }
			}
		],

		//loading动画
		loading: true,

		//列表数据
		dataSource: []
	}

	//新增弹窗配置
	private cereateModal: PermissionCereateModalType = {
		title: '新增', //标题
		okText: '确定', //确定按钮文字
		cancelText: '取消', //取消按钮文字
		visible: false, //是否显示弹窗
		centered: true, //是否垂直居中
		width: 800, //弹窗宽度
		destroyOnClose: true, //关闭时销毁弹窗
		createloading: false, //弹窗loading是否加载完毕
		closeloading: false, //弹窗关闭loading
		labelCol: {
			xs: { span: 24 },
			sm: { span: 5 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		},
		onCancel: () => {
			//弹窗关闭回调
			this.cereateModal.visible = false
			this.cereateModal.closeloading = false
			this.cereateModal.createloading = false
		},

		apply: [], //所有操作类型

		//回显编辑数据
		permission: [], //权限列表
		permission_id: '', //权限模块唯一识别码
		permission_name: '', //权限模块名称
		disable: 0, //状态
		description: '' //权限模块描述
	}

	created() {
		this.permissionAll()
	}

	//获取所有权限模块列表
	async permissionAll() {
		const response = await permissionAll()

		if (response.code === 200) {
			this.table.dataSource = response.data
		}
		this.table.loading = false
	}

	//新增模块权限
	async handelCreateModal() {
		this.cereateModal.visible = true

		const response = await applyAll()
		if (response.code === 200) {
			this.cereateModal.apply = response.data
		}
		this.cereateModal.createloading = true
	}

	//编辑模块权限
	async handelUpdateModel() {}

	//弹窗确定回调
	async handelCloseModal() {
		this.cereateModal.closeloading = true
		this.form.validateFields(async (err: any, form: any) => {
			if (err) {
				setTimeout(() => {
					this.cereateModal.closeloading = false
				}, 600)
				return
			}
			//查找选中的permission数据
			const permission = form.permission.map((id: string) => {
				return this.cereateModal.permission.find(v => v.id === id)
			})

			// for (let index = 1; index < 100; index++) {
			// 	const response = await createPermission({
			// 		permission_id: `${form.permission_id}-${index}`,
			// 		permission_name: form.permission_name,
			// 		description: form.description,
			// 		disable: Boolean(form.disable),
			// 		permission: permission
			// 	})
			// }
			const response = await createPermission({
				permission_id: form.permission_id,
				permission_name: form.permission_name,
				description: form.description,
				disable: Boolean(form.disable),
				permission: permission
			})

			if (response.code === 200) {
				this.table.loading = true
				this.permissionAll()
			}
			this.cereateModal.onCancel()
		})
	}

	//操作
	async handelActionEvent(key: string, props: any) {
		console.log(key, props)
	}

	render() {
		const { getFieldDecorator } = this.form

		return (
			<div class="admin-permission">
				<div class="admin-permission-header">
					<Button type="primary" onClick={this.handelCreateModal}>
						新增
					</Button>
				</div>
				<Table
					bordered={true}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.permission_id}
					locale={{ emptyText: '暂无数据' }}
					scroll={{ x: 1140 }}
					{...{
						scopedSlots: {
							description: (description: string) => {
								return (
									<Tooltip placement="top">
										<template slot="title">
											<span>{description}</span>
										</template>
										<div class="row-ellipsis">{description}</div>
									</Tooltip>
								)
							},
							permission: (permission: Array<{ id: string; name: string }>[]) => {
								return (
									<div>
										{permission.map((k: any) => {
											return <Tag key={k.id}>{k.name}</Tag>
										})}
									</div>
								)
							},
							disable: (disable: boolean) => {
								return <Tag color={disable ? 'pink' : 'green'}>{disable ? '已禁用' : '正常'}</Tag>
							},
							action: (action: any, props: any) => {
								const IconStyle = { fontSize: '14px', margin: '0 0 0 4px' }
								return (
									<div>
										<a onClick={() => this.handelActionEvent('update', props)}>编辑</a>
										<Divider type="vertical"></Divider>
										<Dropdown>
											<a>
												更多
												<Icon type="down" />
											</a>
											<Menu
												slot="overlay"
												onClick={({ key }: { key: string }) => {
													this.handelActionEvent(key, props)
												}}
											>
												<Menu.Item key="update">
													<span style={{ color: Color.info }}>编辑</span>
													<Icon type="setting" style={{ ...IconStyle, color: Color.info }} />
												</Menu.Item>
												<Menu.Item key={props.disable ? 'open' : 'close'}>
													<span style={{ color: props.disable ? Color.ok : Color.warn }}>
														{props.disable ? '打开' : '关闭'}
													</span>
													<Icon
														type={props.disable ? 'stop' : 'check-circle'}
														style={{
															...IconStyle,
															color: props.disable ? Color.ok : Color.warn
														}}
													/>
												</Menu.Item>
												<Menu.Item key="delete">
													<span style={{ color: Color.err }}>删除</span>
													<Icon type="rest" style={{ ...IconStyle, color: Color.err }} />
												</Menu.Item>
											</Menu>
										</Dropdown>
									</div>
								)
							}
						}
					}}
				></Table>

				<Modal
					title={this.cereateModal.title}
					visible={this.cereateModal.visible}
					centered={this.cereateModal.centered}
					width={this.cereateModal.width}
					destroyOnClose={this.cereateModal.destroyOnClose}
					confirmLoading={this.cereateModal.closeloading}
					okText={this.cereateModal.okText}
					cancelText={this.cereateModal.cancelText}
					onCancel={this.cereateModal.onCancel}
					onOk={this.handelCloseModal}
				>
					<Form ref="form" layout="horizontal">
						<Form.Item
							label="权限模块唯一识别码"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission_id', {
								rules: [{ required: true, message: '请输入权限模块唯一识别码' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块唯一识别码" />)}
						</Form.Item>
						<Form.Item
							label="权限模块名称"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission_name', {
								rules: [{ required: true, message: '请输入权限模块名称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="权限模块名称" />)}
						</Form.Item>
						<Form.Item
							label="状态"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('disable', {
								initialValue: 0,
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(
								<Select>
									<Select.Option value={0}>正常</Select.Option>
									<Select.Option value={1}>禁用</Select.Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item
							label="权限模块描述"
							hasFeedback={true}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: '请输入权限模块描述' }],
								validateTrigger: 'change'
							})(<Input.TextArea placeholder="..." rows={5} />)}
						</Form.Item>
						<Form.Item
							label="赋予权限"
							hasFeedback={this.cereateModal.createloading}
							labelCol={this.cereateModal.labelCol}
							wrapperCol={this.cereateModal.wrapperCol}
						>
							{getFieldDecorator('permission', {
								initialValue: [],
								validateTrigger: 'change'
							})(
								<Select mode="multiple" loading={!this.cereateModal.createloading}>
									{this.cereateModal.apply.map(k => {
										return (
											<Select.Option key={k.action} value={k.id} disabled={k.disable}>
												{k.name}
											</Select.Option>
										)
									})}
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(Permission)

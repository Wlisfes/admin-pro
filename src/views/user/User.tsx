/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:07:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 23:47:57
 * @Description: 角色管理界面
 */

import './less/user.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Table, Tag, Avatar, Modal, Input, Select, Divider } from 'ant-design-vue'
import { Actions, AvaterUpload } from '@/components/common'
import { allUser, updateUser, removeUser } from '@/api/user'
import { UserModalType } from '@/interface/user'

@Component({
	props: {
		form: {
			type: Object
		}
	}
})
class User extends Vue {
	private form: any

	//表格配置
	private table = {
		//表头
		columns: [
			{
				title: '用户名',
				dataIndex: 'username',
				align: 'center'
				// width: 140
			},
			{
				title: '用户头像',
				dataIndex: 'avatar',
				align: 'center',
				width: 100,
				scopedSlots: { customRender: 'avatar' }
			},

			{
				title: '昵称',
				dataIndex: 'nick_name',
				align: 'center'
				// width: 140
			},
			{
				title: '角色类型',
				dataIndex: 'roles',
				align: 'center'
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				align: 'center',
				width: 180
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

	private uploadModel = {
		visible: false,
		id: '',
		picUrl: '',
		onCancel: () => {
			this.uploadModel.visible = false
		}
	}

	private userModal: UserModalType = {
		title: '编辑用户', //标题
		okText: '确定', //确定按钮文字
		cancelText: '取消', //取消按钮文字
		visible: false, //是否显示弹窗
		centered: true, //是否垂直居中
		width: 800, //弹窗宽度
		destroyOnClose: true, //关闭时销毁
		labelCol: {
			xs: { span: 24 },
			sm: { span: 5 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		},
		onCancel: () => {
			this.userModal.visible = false
			this.userModal.loading = false
		},
		loading: false,

		id: '',
		username: '',
		nick_name: '',
		disable: 0
	}

	created() {
		this.allUser()
	}

	//获取所有用户列表
	async allUser() {
		const response = await allUser()
		if (response.code === 200) {
			this.table.dataSource = response.data
		}
		this.table.loading = false
	}

	//操作
	async handelAction(params: any) {
		if (params.key === 'update') {
			this.userModal.visible = true
			this.userModal.id = params.id
			this.userModal.username = params.username
			this.userModal.nick_name = params.nick_name
			this.userModal.disable = Number(params.disable)
		} else if (params.key === 'delete') {
			const response = await removeUser({ id: params.id })

			if (response.code === 200) {
				this.allUser()
			}
		} else if (params.key === 'close' || params.key === 'open') {
			const response = await updateUser({
				id: params.id,
				disable: !params.disable
			})

			if (response.code === 200) {
				this.allUser()
			}
		}
	}

	//头像上传
	async onSubmitUpload(params: { id: string; response: { code: number; data: { url: string } } }) {
		if (params.response.code === 200) {
			const response = await updateUser({
				id: params.id,
				avatar: params.response.data.url
			})

			if (response.code === 200) {
				this.uploadModel.visible = false
				this.allUser()
			}
		}
	}

	//更新用户信息
	async onSubmitUser() {
		this.userModal.loading = true
		this.form.validateFields(
			async (err: any, form: { id: string; username: string; nick_name: string; disable: number }) => {
				if (err) {
					setTimeout(() => {
						this.userModal.loading = false
					}, 600)
					return
				}

				const response = await updateUser({
					id: form.id,
					username: form.username,
					nick_name: form.nick_name,
					disable: Boolean(form.disable),
					password: '3633'
				})

				if (response.code === 200) {
					this.allUser()
				}
				this.userModal.onCancel()
			}
		)
	}

	render() {
		const { getFieldDecorator } = this.form

		return (
			<div class="admin-user">
				<Table
					bordered={true}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					locale={{ emptyText: '暂无数据' }}
					scroll={{ x: 780 }}
					{...{
						scopedSlots: {
							avatar: (avatar: string, props: any) => {
								return avatar ? (
									<Avatar
										size={50}
										shape="square"
										src={props.avatar}
										style={{ cursor: 'pointer' }}
										onClick={() => {
											this.uploadModel.id = props.id
											this.uploadModel.visible = true
											this.uploadModel.picUrl = props.avatar
										}}
									></Avatar>
								) : (
									<Avatar
										size={50}
										shape="square"
										icon="user"
										style={{ cursor: 'pointer', backgroundColor: '#fde3cf' }}
										onClick={() => {
											this.uploadModel.id = props.id
											this.uploadModel.visible = true
										}}
									></Avatar>
								)
							},
							disable: (disable: boolean) => {
								return (
									<Tag style={{ marginRight: 0 }} color={disable ? 'pink' : 'green'}>
										{disable ? '已禁用' : '正常'}
									</Tag>
								)
							},
							action: (action: any, props: any) => {
								return <Actions params={props} onActions={this.handelAction}></Actions>
							}
						}
					}}
				></Table>

				<AvaterUpload
					id={this.uploadModel.id}
					visible={this.uploadModel.visible}
					onCancel={this.uploadModel.onCancel}
					picUrl={this.uploadModel.picUrl}
					onSubmit={this.onSubmitUpload}
				></AvaterUpload>

				<Modal
					title={this.userModal.title}
					visible={this.userModal.visible}
					centered={this.userModal.centered}
					width={this.userModal.width}
					okText={this.userModal.okText}
					cancelText={this.userModal.cancelText}
					confirmLoading={this.userModal.loading}
					destroyOnClose={this.userModal.destroyOnClose}
					onCancel={this.userModal.onCancel}
					onOk={this.onSubmitUser}
				>
					<Form layout="horizontal">
						<Form.Item
							style={{ display: 'none' }}
							hasFeedback={true}
							labelCol={this.userModal.labelCol}
							wrapperCol={this.userModal.wrapperCol}
						>
							{getFieldDecorator('id', {
								initialValue: this.userModal.id,
								validateTrigger: 'change'
							})(<Input type="text" disabled />)}
						</Form.Item>
						<Form.Item
							label="用户名"
							hasFeedback={true}
							labelCol={this.userModal.labelCol}
							wrapperCol={this.userModal.wrapperCol}
						>
							{getFieldDecorator('username', {
								initialValue: this.userModal.username,
								rules: [{ required: true, message: '请输入用户名' }],
								validateTrigger: 'change'
							})(<Input type="text" disabled placeholder="请输入用户名" />)}
						</Form.Item>
						<Form.Item
							label="用户昵称"
							hasFeedback={true}
							labelCol={this.userModal.labelCol}
							wrapperCol={this.userModal.wrapperCol}
						>
							{getFieldDecorator('nick_name', {
								initialValue: this.userModal.nick_name,
								rules: [{ required: true, message: '请输入用户昵称' }],
								validateTrigger: 'change'
							})(<Input type="text" placeholder="请输入用户昵称" />)}
						</Form.Item>
						<Form.Item
							label="状态"
							hasFeedback={true}
							labelCol={this.userModal.labelCol}
							wrapperCol={this.userModal.wrapperCol}
						>
							{getFieldDecorator('disable', {
								initialValue: this.userModal.disable,
								rules: [{ required: true, message: '请选择权限模块状态' }],
								validateTrigger: 'change'
							})(
								<Select>
									<Select.Option value={0}>正常</Select.Option>
									<Select.Option value={1}>禁用</Select.Option>
								</Select>
							)}
						</Form.Item>

						<Divider></Divider>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(User)

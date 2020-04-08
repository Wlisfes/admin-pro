/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:07:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 23:39:49
 * @Description: 角色管理界面
 */

import './less/user.less'

import { Vue, Component } from 'vue-property-decorator'
import { Form, Table, Tag, Avatar, Modal, Input, Select, Divider, Upload } from 'ant-design-vue'
import { Actions } from '@/components/common'
import { userAll } from '@/api/user'
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
				align: 'center',
				width: 140
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
				align: 'center',
				width: 140
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
				width: 160
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

	private userModal: UserModalType = {
		title: '编辑用户', //标题
		okText: '确定', //确定按钮文字
		cancelText: '取消', //取消按钮文字
		visible: false, //是否显示弹窗
		centered: true, //是否垂直居中
		width: 800, //弹窗宽度
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
		},

		username: '',
		nick_name: '',
		disable: 0
	}

	created() {
		this.userAll()
	}

	//获取所有用户列表
	async userAll() {
		const response = await userAll()
		if (response.code === 200) {
			this.table.dataSource = response.data
		}
		this.table.loading = false
	}

	//操作
	async handelAction(params: any) {
		if (params.key === 'update') {
			this.userModal.visible = true
			this.userModal.username = params.username
			this.userModal.nick_name = params.nick_name
			this.userModal.disable = Number(params.disable)
			console.log(params)
		}
	}

	//头像上传change事件
	handelUploadChange(info: any) {
		console.log(info, 222)
	}

	uploadBeforeUpload(file: any) {
		console.log(file, 111)
		return false
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
					scroll={{ x: 920 }}
					{...{
						scopedSlots: {
							avatar: (avatar: string) => {
								return avatar ? (
									<Avatar
										size={50}
										shape="square"
										src="https://lisfes.cn/assets/album/0bc087d84ae4a.png"
									></Avatar>
								) : (
									<Avatar
										size={50}
										shape="square"
										icon="user"
										style={{ backgroundColor: '#fde3cf' }}
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

				<Modal
					title={this.userModal.title}
					visible={this.userModal.visible}
					centered={this.userModal.centered}
					width={this.userModal.width}
					okText={this.userModal.okText}
					cancelText={this.userModal.cancelText}
					onCancel={this.userModal.onCancel}
				>
					<Form layout="horizontal">
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
							label="用户头像"
							hasFeedback={false}
							labelCol={this.userModal.labelCol}
							wrapperCol={this.userModal.wrapperCol}
						>
							<div class="upload-container">
								<div>
									{getFieldDecorator(
										'avatar',
										{}
									)(
										<Upload
											name="avatar"
											listType="picture-card"
											class="avatar-uploader"
											showUploadList={false}
											action="/api/api/upload"
											onChange={this.handelUploadChange}
											beforeUpload={this.uploadBeforeUpload}
										>
											{false ? (
												<img src={''} alt="avatar" />
											) : (
												<div class="ant-upload-text">Upload</div>
											)}
										</Upload>
									)}
								</div>
								<div class="upload-container-crop">12313</div>
							</div>
						</Form.Item>
						<Divider></Divider>
					</Form>
				</Modal>
			</div>
		)
	}
}

export default Form.create({})(User)

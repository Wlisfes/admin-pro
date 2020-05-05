/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:07:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-05 23:00:13
 * @Description: 角色管理界面
 */

import './less/user.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Avatar } from 'ant-design-vue'
import { Actions, AvaterUpload } from '@/components/common'
import { UpdateUserModal } from './modules'
import { allUser, updateUser, deleteUser, changeUser } from '@/api/user'
import moment from 'moment'

@Component
export default class User extends Vue {
	//表格配置
	private table = {
		//表头
		columns: [
			{ title: '用户头像', dataIndex: 'avatar', width: '9%', scopedSlots: { customRender: 'avatar' } },
			{ title: '用户名', width: '9%', dataIndex: 'username' },
			{ title: '昵称', width: '9%', dataIndex: 'nickname' },
			{ title: '邮箱', dataindex: 'email', scopedSlots: { customRender: 'email' } },
			{ title: '手机', width: '14%', dataindex: 'mobile', scopedSlots: { customRender: 'mobile' } },
			{ title: '角色类型', width: '11%', dataIndex: 'roles', scopedSlots: { customRender: 'roles' } },
			{ title: '注册时间', width: '12%', dataIndex: 'create_time', scopedSlots: { customRender: 'createtime' } },
			{ title: '状态', width: '9%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],

		//loading动画
		loading: true,

		//列表数据
		dataSource: []
	}

	//头像上传组件配置
	private uploadModel = {
		id: '',
		picUrl: '',
		visible: false,
		onCancel: () => {
			this.uploadModel.visible = false
		},
		//头像上传
		onSubmit: async (params: {
			id: string
			timeout: Function
			response: { code: number; data: { url: string } }
		}) => {
			params.timeout()
			this.uploadModel.visible = false

			if (params.response.code === 200) {
				const response = await updateUser({
					id: params.id,
					avatar: params.response.data.url
				})
				if (response.code === 200) {
					this.table.loading = true
					this.allUser()
				}
			}
		}
	}

	//用户信息修改配置
	private updateUserModal = {
		visible: false,
		id: '',
		username: '',
		nickname: '',
		email: '',
		mobile: '',
		status: 1,
		roles: null,
		onCancel: () => {
			this.updateUserModal.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.allUser()
			this.updateUserModal.visible = false
		}
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
		this.table.loading = true
		if (params.key === 'auth') {
		} else if (params.key === 'update') {
			this.updateUserModal.id = params.id
			this.updateUserModal.username = params.username
			this.updateUserModal.nickname = params.nickname
			this.updateUserModal.email = params.email
			this.updateUserModal.mobile = params.mobile
			this.updateUserModal.status = params.status
			this.updateUserModal.roles = params.roles
			this.updateUserModal.visible = true
		} else if (params.key === 'delete') {
			const response = await deleteUser({ id: params.id })

			if (response.code === 200) {
				this.$notification.success({ message: '删除成功', description: '' })
				this.allUser()
				return
			}
		} else if (params.key === 'close' || params.key === 'open') {
			const response = await changeUser({
				id: params.id,
				status: params.key === 'open' ? 1 : 0
			})

			if (response.code === 200) {
				this.allUser()
				return
			}
		}
		this.table.loading = false
	}

	render() {
		return (
			<div class="admin-user">
				{
					/**用户信息修改组件**/
					<UpdateUserModal
						{...{ props: this.updateUserModal }}
						onCancel={this.updateUserModal.onCancel}
						onSubmit={this.updateUserModal.onSubmit}
					></UpdateUserModal>
				}

				{
					/**头像上传组件**/
					<AvaterUpload
						{...{ props: this.uploadModel }}
						onCancel={this.uploadModel.onCancel}
						onSubmit={this.uploadModel.onSubmit}
					></AvaterUpload>
				}

				<Table
					bordered={false}
					columns={this.table.columns}
					dataSource={this.table.dataSource}
					loading={this.table.loading}
					rowKey={(record: any) => record.id}
					scroll={{ x: 1000 }}
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
										size={48}
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
							email: (email: any, props: any) => <div>{props.email || '------'}</div>,
							mobile: (mobile: any, props: any) => <div>{props.mobile || '------'}</div>,
							roles: (roles: any) => <div>{roles.role_name || '游客'}</div>,
							createtime: (createtime: string) => <div>{moment(createtime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => {
								return (
									<Tag style={{ marginRight: 0 }} color={status ? 'green' : 'pink'}>
										{status ? '正常' : '已禁用'}
									</Tag>
								)
							},
							action: (action: any, props: any) => {
								return <Actions params={props} onActions={this.handelAction}></Actions>
							}
						}
					}}
				></Table>
			</div>
		)
	}
}

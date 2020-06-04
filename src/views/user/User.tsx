/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:07:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-04 23:24:59
 * @Description: 角色管理界面
 */

import './less/user.less'

import { Vue, Component } from 'vue-property-decorator'
import { Table, Tag, Avatar, Tooltip } from 'ant-design-vue'
import { AvaterUpload, CommEdit } from '@/components/common'
import { UpdateUserModal, UpdateUserAuthModal } from './modules'
import { allUser, deleteUser, cutoverUser, updateUserAvatar, UserType } from '@/api/user'
import { Color } from '@/interface'
import moment from 'moment'

@Component
export default class User extends Vue {
	//表格配置
	private table = {
		columns: [
			{ title: '用户头像', dataIndex: 'avatar', width: '9%', scopedSlots: { customRender: 'avatar' } },
			{ title: '用户名', width: '9%', dataIndex: 'username' },
			{ title: '昵称', width: '9%', dataIndex: 'nickname' },
			{ title: '邮箱', dataindex: 'email', scopedSlots: { customRender: 'email' } },
			{ title: '手机', width: '14%', dataindex: 'mobile', scopedSlots: { customRender: 'mobile' } },
			{ title: '角色类型', width: '11%', dataIndex: 'role', scopedSlots: { customRender: 'role' } },
			{ title: '注册时间', width: '12%', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
			{ title: '状态', width: '9%', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
			{ title: '操作', width: 130, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
		],
		loading: true,
		dataSource: [],
		pageSize: 10,
		pageSizeOptions: ['10', '15', '20', '30', '40', '50'],
		showSizeChanger: true,
		current: 1
	}

	//头像上传组件配置
	private uploadModel = {
		uid: 0,
		picUrl: '',
		visible: false,
		onCancel: () => {
			this.uploadModel.visible = false
		},
		//头像上传
		onSubmit: async (params: {
			uid: number
			timeout: Function
			response: { code: number; data: { path: string } }
		}) => {
			params.timeout()
			this.uploadModel.visible = false
			if (params.response.code === 200) {
				this.table.loading = true
				const response = await updateUserAvatar({
					uid: params.uid,
					avatar: params.response.data.path
				})
				if (response.code === 200) {
					this.allUser()
				}
			}
		}
	}

	//用户信息修改配置
	private updateUserModal = {
		visible: false,
		uid: 0,
		onCancel: () => {
			this.updateUserModal.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.allUser()
			this.updateUserModal.visible = false
		}
	}

	//用户权限修改配置
	private updateUserAuthModal = {
		visible: false,
		uid: 0,
		onCancel: () => {
			this.updateUserAuthModal.visible = false
		},
		onSubmit: () => {
			this.table.loading = true
			this.allUser()
			this.updateUserAuthModal.visible = false
		}
	}

	created() {
		this.allUser()
	}

	//获取所有用户列表
	async allUser() {
		const response = await allUser()
		if (response.code === 200) {
			this.table.dataSource = response.data as []
		}
		this.table.loading = false
	}

	//操作
	async onChange({ key, props }: { key: string; props: UserType }) {
		this.table.loading = true

		//修改用户信息
		if (key === 'update') {
			this.updateUserModal.uid = props.uid
			this.updateUserModal.visible = true
		}

		//修改用户权限
		if (key === 'auth') {
			this.updateUserAuthModal.uid = props.uid
			this.updateUserAuthModal.visible = true
		}

		//切换状态
		if (key === 'status') {
			const response = await cutoverUser({ uid: props.uid })
			if (response.code === 200) {
				this.allUser()
				return
			}
		}

		//删除
		if (key === 'delete') {
			const response = await deleteUser({ uid: props.uid })
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
				{/**用户信息修改组件**/
				this.updateUserModal.visible && (
					<UpdateUserModal
						{...{ props: this.updateUserModal }}
						onCancel={this.updateUserModal.onCancel}
						onSubmit={this.updateUserModal.onSubmit}
					/>
				)}

				{/**用户权限修改组件**/
				this.updateUserAuthModal.visible && (
					<UpdateUserAuthModal
						{...{ props: this.updateUserAuthModal }}
						onCancel={this.updateUserAuthModal.onCancel}
						onSubmit={this.updateUserAuthModal.onSubmit}
					/>
				)}

				{
					/**头像上传组件**/
					<AvaterUpload
						{...{ props: this.uploadModel }}
						onCancel={this.uploadModel.onCancel}
						onSubmit={this.uploadModel.onSubmit}
					/>
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
							avatar: (avatar: string, props: UserType) => {
								return avatar ? (
									<Avatar
										size={50}
										shape="square"
										src={props.avatar}
										style={{ cursor: 'pointer' }}
										onClick={() => {
											this.uploadModel.uid = props.uid
											this.uploadModel.visible = true
											this.uploadModel.picUrl = props.avatar || ''
										}}
									></Avatar>
								) : (
									<Avatar
										size={48}
										shape="square"
										icon="user"
										style={{ cursor: 'pointer', backgroundColor: '#fde3cf' }}
										onClick={() => {
											this.uploadModel.uid = props.uid
											this.uploadModel.visible = true
										}}
									></Avatar>
								)
							},
							email: (email: any, props: UserType) => {
								const EmailVNode = (
									<span class="row-ellipsis" style={{ cursor: 'pointer' }}>
										{props.email || '------'}
									</span>
								)
								return props.email ? (
									<Tooltip placement="top" title={props.email}>
										{EmailVNode}
									</Tooltip>
								) : (
									EmailVNode
								)
							},
							mobile: (mobile: any, props: UserType) => {
								const MobileVNode = (
									<span style={{ cursor: 'pointer' }}>{props.mobile || '------'}</span>
								)
								return props.mobile ? (
									<Tooltip placement="top" title={props.mobile}>
										{MobileVNode}
									</Tooltip>
								) : (
									MobileVNode
								)
							},
							role: (role: any, props: UserType) => <div>{props.role?.role_name || '游客'}</div>,
							createTime: (createTime: string) => <div>{moment(createTime).format('YYYY-MM-DD')}</div>,
							status: (status: number) => {
								return (
									<Tag style={{ marginRight: 0 }} color={status ? 'green' : 'pink'}>
										{status ? '正常' : '已禁用'}
									</Tag>
								)
							},
							action: (action: any, props: UserType) => {
								return (
									<CommEdit
										params={{
											props,
											first: { key: 'update', name: '编辑' },
											last: { key: 'more', name: '更多', more: true },
											menu: [
												{ key: 'auth', name: '权限', icon: 'setting', color: Color.info },
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

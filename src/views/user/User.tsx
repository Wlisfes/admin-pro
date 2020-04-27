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

			// if (response.code === 200) {
			// 	this.uploadModel.visible = false
			// 	this.allUser()
			// }
		}
	}

	render() {
		return (
			<div class="admin-user">
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
											// this.uploadModel.id = props.id
											// this.uploadModel.visible = true
											// this.uploadModel.picUrl = props.avatar
										}}
									></Avatar>
								) : (
									<Avatar
										size={48}
										shape="square"
										icon="user"
										style={{ cursor: 'pointer', backgroundColor: '#fde3cf' }}
										onClick={() => {
											// this.uploadModel.id = props.id
											// this.uploadModel.visible = true
										}}
									></Avatar>
								)
							},
							email: (email: string | null) => <div>876451336</div>,
							mobile: (mobile: number | null) => <div>18888888888</div>,
							roles: (roles: any) => <div>超级管理员</div>,
							createtime: (createtime: string) => <div>2020-04-27</div>,
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

				{/* <AvaterUpload
					id={this.uploadModel.id}
					visible={this.uploadModel.visible}
					onCancel={this.uploadModel.onCancel}
					picUrl={this.uploadModel.picUrl}
					onSubmit={this.onSubmitUpload}
				></AvaterUpload> */}
			</div>
		)
	}
}

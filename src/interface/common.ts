/*
 * @Author: 情雨随风
 * @Date: 2020-04-23 20:51:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 19:47:46
 * @Description: 公用配置
 */

//颜色配置
export enum Color {
	ok = '#52c41a',
	err = '#f5222d',
	info = '#1890ff',
	warn = '#faad14',
	create = 'pink',
	delete = 'red',
	update = 'orange',
	query = 'green',
	get = 'cyan',
	import = 'blue',
	export = 'purple'
}

//可操作权限列表
export const Apply = [
	{ name: '新增', key: 'create', status: 0 },
	{ name: '删除', key: 'delete', status: 0 },
	{ name: '修改', key: 'update', status: 0 },
	{ name: '查询', key: 'query', status: 0 },
	{ name: '详情', key: 'get', status: 0 },
	{ name: '导入', key: 'import', status: 0 },
	{ name: '导出', key: 'export', status: 0 }
]

//共弹窗配置
export const CommonModal = {
	visible: false,
	okText: '确定',
	cancelText: '取消',
	centered: true,
	width: 800,
	destroyOnClose: true,
	loading: false,
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 18 }
	}
}

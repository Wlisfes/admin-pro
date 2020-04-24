/*
 * @Author: 情雨随风
 * @Date: 2020-04-23 20:51:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-23 21:59:23
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
	{ apply_name: '新增', apply_key: 'create', status: 0 },
	{ apply_name: '删除', apply_key: 'delete', status: 0 },
	{ apply_name: '修改', apply_key: 'update', status: 0 },
	{ apply_name: '查询', apply_key: 'query', status: 0 },
	{ apply_name: '详情', apply_key: 'get', status: 0 },
	{ apply_name: '导入', apply_key: 'import', status: 0 },
	{ apply_name: '导出', apply_key: 'export', status: 0 }
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
		sm: { span: 5 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
}

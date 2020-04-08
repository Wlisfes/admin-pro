export interface ApplyType {
	id?: string
	name?: string
	action?: string
	disable?: boolean
	check?: boolean
	[key: string]: any
}

export interface PermissionCereateModalType {
	title: string
	okText: string
	cancelText: string
	visible: boolean
	centered: boolean
	width: number
	destroyOnClose: boolean
	createloading: boolean
	closeloading: boolean
	labelCol: {
		xs: { span: number }
		sm: { span: number }
	}
	wrapperCol: {
		xs: { span: number }
		sm: { span: number }
	}
	onCancel: () => void
	apply: ApplyType[]

	permission: ApplyType[]
	permission_id: string
	permission_name: string
	disable: boolean | number
	description: string
}

export interface ApplyType {
	id?: string
	name?: string
	action?: string
	disable?: boolean
	check?: boolean
	[key: string]: any
}

interface ModalType {
	title: string
	okText: string
	cancelText: string
	visible: boolean
	centered: boolean
	width: number
	labelCol: {
		xs: { span: number }
		sm: { span: number }
	}
	wrapperCol: {
		xs: { span: number }
		sm: { span: number }
	}
	onCancel: () => void
}

export interface PermissionCereateModalType extends ModalType {
	destroyOnClose: boolean
	createloading: boolean
	closeloading: boolean

	apply: ApplyType[]

	permission: ApplyType[]
	permission_id: string
	permission_name: string
	disable: boolean | number
	description: string
}

export interface UserModalType extends ModalType {
	username: string
	nick_name: string
	disable: string | number
}

export interface AppUserRole {
	createTime: string
	id: number
	role_key: string
	role_name: string
	status: number
}

export interface AppUser {
	id: number
	uid: number
	access_token: string
	username: string
	nickname: string
	avatar: string | null
	email: string | null
	mobile: number | null
	status: number
	createTime: string
	role: AppUserRole
}

export interface AppState {
	user: AppUser | null
	device: string
	collapsed: boolean
	theme: string
	primaryColor: string
	multiple: boolean
	openKeys: Array<string>
	selectedKeys: Array<string>
	siderfixed: boolean
	headerfixed: boolean
	noneheader: boolean
}

/*
 * @Author: 情雨随风
 * @Date: 2020-05-31 15:53:52
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 19:44:20
 * @Description: user下接口
 */

export interface RoleType {
	id: number
	role_key: string
	role_name: string
	status: number
	createTime: string
}

export interface ApplyType {
	key: string
	name: string
	status: number
}

export interface AuthType {
	id: number
	auth_key: string
	auth_name: string
	status: number
	createTime: string
	apply: ApplyType[]
}

export interface UserTypes {
	id: number
	uid: number
	username: string
	nickname: string
	status: number
	createTime: string
	password?: string
	email?: string | null
	mobile?: string | null
	avatar?: string | null
	article?: [] | null
	role?: RoleType | null
	auth?: AuthType[] | null
	[key: string]: any
}

/*
 * @Date: 2020-04-08 15:38:34
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-05 14:20:30
 * @Description: 全局接口类型
 */

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
	blue = 'blue',
	import = 'blue',
	export = 'purple'
}

export interface VueCropperOptions {
	img: string
	autoCrop: boolean
	autoCropWidth: number
	autoCropHeight: number
	fixedBox: boolean
	info: boolean
}

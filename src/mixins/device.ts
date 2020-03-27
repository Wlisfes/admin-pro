/*
 * @Date: 2020-03-27 15:52:11
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-27 16:09:16
 * @Description: 监听窗口变化
 */

import enquireJs from 'enquire.js'

export interface deviceType {
	DESKTOP: string
	TABLET: string
	MOBILE: string
}
export interface matchType {
	match: () => void
}

export const DEVICE_TYPE: deviceType = {
	DESKTOP: 'desktop',
	TABLET: 'tablet',
	MOBILE: 'mobile'
}

export function deviceEnquire(callback: (deviceType: string) => void) {
	const matchDesktop: matchType = {
		match: () => {
			callback && callback(DEVICE_TYPE.DESKTOP)
		}
	}

	const matchLablet: matchType = {
		match: () => {
			callback && callback(DEVICE_TYPE.TABLET)
		}
	}
	const matchMobile: matchType = {
		match: () => {
			callback && callback(DEVICE_TYPE.MOBILE)
		}
	}

	enquireJs
		.register('screen and (max-width: 576px)', matchMobile)
		.register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet)
		.register('screen and (min-width: 1200px)', matchDesktop)
}

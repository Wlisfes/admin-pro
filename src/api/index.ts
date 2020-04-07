/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 21:20:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-06 23:54:01
 * @Description: 全局api接口
 */

import http from '@/utils/request'

//登录
export const login = (params: { username: string; password: string }) => {
	return http({
		url: `/api/user/login`,
		method: 'POST',
		data: params
	})
}

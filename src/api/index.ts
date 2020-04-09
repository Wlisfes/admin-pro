/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 21:20:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 22:39:21
 * @Description: 全局api接口
 */

import http from '@/utils/request'

//图片上传
export const upload = (params: FormData) => {
	return http({
		url: '/api/upload',
		method: 'POST',
		data: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

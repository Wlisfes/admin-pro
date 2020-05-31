/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 21:20:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-31 10:26:52
 * @Description: 全局api接口
 */

import http from '@/utils/request'

//单张图片上传
export const uploadFile = (params: FormData) => {
	return http({
		url: '/api/oss/upload/file',
		method: 'POST',
		data: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

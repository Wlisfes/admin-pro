// import client from 'webpack-theme-color-replacer/client'
const client = require('webpack-theme-color-replacer/client')
import generate from '@ant-design/colors/lib/generate'
import { message } from 'ant-design-vue'

const themeColor = {
	getAntdSerials(color: string) {
		// 淡化（即less的tint）
		const lightens = new Array(9).fill(null).map((t, i) => {
			return client.varyColor.lighten(color, i / 10)
		})
		// colorPalette变换得到颜色值
		const colorPalettes = generate(color)
		const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',')
		return lightens.concat(colorPalettes).concat(rgb)
	},
	changeColor(newColor: string) {
		var options = {
			newColors: this.getAntdSerials(newColor),
			changeUrl(cssUrl: string) {
				return `/${cssUrl}`
			}
		}
		return client.changer.changeColor(options, Promise)
	}
}

export const colorList = [
	{
		key: '薄暮',
		color: '#F5222D'
	},
	{
		key: '火山',
		color: '#FA541C'
	},
	{
		key: '日暮',
		color: '#FAAD14'
	},
	{
		key: '明青',
		color: '#13C2C2'
	},
	{
		key: '极光绿',
		color: '#52C41A'
	},
	{
		key: '拂晓蓝（默认）',
		color: '#1890FF'
	},
	{
		key: '极客蓝',
		color: '#2F54EB'
	},
	{
		key: '酱紫',
		color: '#722ED1'
	}
]

export const updateTheme = (newPrimaryColor: string) => {
	const hideMessage = message.loading('正在切换主题！', 0)
	themeColor.changeColor(newPrimaryColor).finally(() => {
		setTimeout(() => {
			hideMessage()
		})
	})
}

export const updateColorWeak = (colorWeak: string) => {
	colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
}

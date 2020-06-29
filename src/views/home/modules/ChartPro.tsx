/*
 * @Date: 2020-06-29 11:22:07
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:42:04
 * @Description: 数量统计图表
 */

import { Vue, Component } from 'vue-property-decorator'
import { Chart } from '@antv/g2'
import { AppCount } from '@/api'

@Component
export default class ChartPro extends Vue {
	protected mounted() {
		this.CreateChart()
	}

	//创建图表
	public async CreateChart() {
		const response = await AppCount()
		if (response.code === 200) {
			const data = [
				{ name: '用户', value: response.data.user },
				{ name: '标签', value: response.data.tag },
				{ name: '文章', value: response.data.article },
				{ name: '笔记', value: response.data.notes },
				{ name: '项目', value: response.data.project }
			]
			const chart = new Chart({
				container: 'chart-pro',
				autoFit: true,
				height: 500
			})

			chart.data(data)
			chart.scale('sales', { nice: true })
			chart.tooltip({ showMarkers: false })

			chart.interaction('active-region')
			chart
				.interval()
				.position('name*value')
				.color('name')
			chart.render()
		}
	}

	protected render() {
		return <div id="chart-pro" style={{ height: '100%', width: '100%' }}></div>
	}
}

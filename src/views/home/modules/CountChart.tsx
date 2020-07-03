/*
 * @Date: 2020-06-29 11:22:07
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-29 14:42:04
 * @Description: 数量统计图表
 */

import { Vue, Component } from 'vue-property-decorator'
import { Skeleton, Empty } from 'ant-design-vue'
import { Chart } from '@antv/g2'
import { AppCount } from '@/api'

@Component
export default class CountChart extends Vue {
	private loading: boolean = true
	private success: boolean = true

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
				container: this.$refs.chart as HTMLElement,
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
			this.success = false
		}
		this.loading = false
	}

	protected render() {
		return (
			<div ref="chart" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
				{this.loading ? (
					<div style={{ margin: 'auto 0' }}>
						<Skeleton active paragraph={{ rows: 4 }} />
						<Skeleton active paragraph={{ rows: 4 }} />
					</div>
				) : (
					this.success && (
						<div style={{ overflow: 'hidden' }}>
							<Empty image={(Empty as any).PRESENTED_IMAGE_SIMPLE} style={{ margin: '142px 24px' }} />
						</div>
					)
				)}
			</div>
		)
	}
}

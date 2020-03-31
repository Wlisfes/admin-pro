/*
 * @Date: 2020-03-30 14:04:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-03-31 11:10:45
 * @Description: 系统设置组件
 */

import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { colorList, updateTheme, updateColorWeak } from '@/components/layout/settingConfig'
import { Drawer, Icon, Tooltip, List, Switch, Divider, Tag } from 'ant-design-vue'
import lightSvg from '@/assets/image/light.svg'
import darkSvg from '@/assets/image/dark.svg'

const AppModule = namespace('app')

interface Color {
	key: string
	color: string
}

@Component
export default class Setting extends Vue {
	@AppModule.State(state => state.theme) theme!: string
	@AppModule.State(state => state.siderfixed) siderfixed!: boolean
	@AppModule.State(state => state.headerfixed) headerfixed!: boolean
	@AppModule.State(state => state.noneheader) noneheader!: boolean
	@AppModule.State(state => state.multiple) multiple!: boolean
	@AppModule.State(state => state.primaryColor) primaryColor!: string

	@AppModule.Mutation('SET_THEME') SET_THEME!: Function
	@AppModule.Mutation('SET_SIDERFIXED') SET_SIDERFIXED!: Function
	@AppModule.Mutation('SET_HEADERFIXED') SET_HEADERFIXED!: Function
	@AppModule.Mutation('SET_NONEHEADER') SET_NONEHEADER!: Function
	@AppModule.Mutation('SET_MULTIPLE') SET_MULTIPLE!: Function
	@AppModule.Mutation('SET_PRIMARYCOLOR') SET_PRIMARYCOLOR!: Function

	private visible: boolean = false
	private colorList: Color[] = colorList

	mounted() {
		updateTheme(this.primaryColor)

	}

	public onClose(): void {
		this.visible = false
	}

	//修改风格
	public onClickTheme = (theme: string): void => {
		this.SET_THEME(theme)
	}

	//是否固定头部
	public onChangeHeader = (header: boolean): void => {
		this.SET_HEADERFIXED(header)
	}

	//下滑是否隐藏头部
	public onChangeNoneHeader = (header: boolean): void => {
		this.SET_NONEHEADER(header)
	}

	//是否固定侧边菜单
	public onChangeSider = (sider: boolean): void => {
		this.SET_SIDERFIXED(sider)
	}

	//选择颜色主题
	public onChangeColor(color: string) {
		if (this.primaryColor !== color) {
			this.SET_PRIMARYCOLOR(color)
			updateTheme(color)
		}
	}

	render() {
		return (
			<div class="setting-drawer">
				<Drawer
					width="300"
					placement="right"
					keyboard={true}
					visible={this.visible}
					closable={false}
					onClose={this.onClose}
				>
					<div class="setting-drawer-content">
						{
							/**整体风格设置**/
							<div class="setting-drawer-proStyle">
								<h2>整体风格设置</h2>
								<div class="setting-drawer-tooltip">
									<Tooltip>
										<div slot="title">暗色菜单风格</div>
										<div
											class="setting-drawer-tooltip-item"
											onClick={() => {
												this.onClickTheme('dark')
											}}
										>
											<img src={darkSvg} alt="dark" />
											{this.theme === 'dark' && (
												<div class="setting-drawer-index-selectIcon">
													<Icon type="check" />
												</div>
											)}
										</div>
									</Tooltip>
									<Tooltip>
										<template slot="title">亮色菜单风格</template>
										<div
											class="setting-drawer-tooltip-item"
											onClick={() => {
												this.onClickTheme('light')
											}}
										>
											<img src={lightSvg} alt="light" />
											{this.theme === 'light' && (
												<div class="setting-drawer-index-selectIcon">
													<Icon type="check" />
												</div>
											)}
										</div>
									</Tooltip>
								</div>
							</div>
						}

						{
							/**主题色**/
							<div class="setting-drawer-theme">
								<h2>主题色</h2>
								<div class="theme-tags">
									{this.colorList.map((k, i) => {
										return (
											<Tooltip key={i}>
												<template slot="title">{k.key}</template>
												<Tag
													color={k.color}
													onClick={() => {
														this.onChangeColor(k.color)
													}}
												>
													{this.primaryColor === k.color && <Icon type="check"></Icon>}
												</Tag>
											</Tooltip>
										)
									})}
								</div>
							</div>
						}

						<Divider />

						{
							//导航设置
							<div class="setting-drawer-header">
								<h2>导航设置</h2>
								<List split={false}>
									<List.Item>
										<Switch
											slot="actions"
											size="small"
											defaultChecked={this.headerfixed}
											onChange={this.onChangeHeader}
										/>
										<List.Item.Meta>
											<div slot="title">固定 Header</div>
										</List.Item.Meta>
									</List.Item>
									{false && (
										<List.Item>
											<Switch
												slot="actions"
												size="small"
												disabled={!this.headerfixed}
												defaultChecked={this.noneheader}
												onChange={this.onChangeNoneHeader}
											/>
											<List.Item.Meta>
												<Tooltip slot="title" placement="left">
													<div slot="title">固定 Header 时可配置</div>
													<div style={{ opacity: !this.headerfixed ? '0.5' : 1 }}>
														下滑时隐藏 Header
													</div>
												</Tooltip>
											</List.Item.Meta>
										</List.Item>
									)}
									<List.Item>
										<Switch
											slot="actions"
											size="small"
											defaultChecked={this.siderfixed}
											onChange={this.onChangeSider}
										/>
										<List.Item.Meta>
											<div slot="title">固定侧边菜单</div>
										</List.Item.Meta>
									</List.Item>
								</List>
							</div>
						}

						<Divider />

						{
							//其他设置
							<div class="setting-drawer-other">
								<h2>其他设置</h2>
								<List split={false}>
									<List.Item>
										<Switch slot="actions" size="small" defaultChecked={this.multiple} />
										<List.Item.Meta>
											<div slot="title">多页签模式</div>
										</List.Item.Meta>
									</List.Item>
								</List>
							</div>
						}
					</div>
				</Drawer>
				<div
					class="setting-drawer-toggle"
					style={{ right: this.visible ? '300px' : '0' }}
					onClick={() => {
						this.visible = !this.visible
					}}
				>
					<Icon type={this.visible ? 'close' : 'setting'} />
				</div>
			</div>
		)
	}
}

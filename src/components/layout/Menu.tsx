/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 18:09:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-28 18:51:25
 * @Description: 菜单组件
 */

import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Menu, Icon } from 'ant-design-vue'

const AppModule = namespace('app')

const menu = [
	{
		key: 'home',
		icon: 'home',
		title: '主页',
		children: [
			{
				key: 'home-index',
				title: '首页',
				path: '/'
			}
		]
	},
	{
		key: 'admin',
		icon: 'team',
		title: '管理员/权限',
		children: [
			{
				key: 'admin-register',
				title: '用户注册',
				path: '/user'
			},
			{
				key: 'admin-role',
				title: '角色管理',
				path: '/'
			},
			{
				key: 'admin-access',
				title: '权限管理',
				path: '/'
			}
		]
	},
	{
		key: 'article',
		icon: 'chrome',
		title: '文章管理',
		children: [
			{
				key: 'add-article',
				title: '新增文章',
				path: '/'
			},
			{
				key: 'article-list',
				title: '文章列表',
				path: '/'
			}
		]
	},
	{
		key: 'note',
		icon: 'chrome',
		title: '笔记管理',
		children: [
			{
				key: 'add-note',
				title: '新增笔记',
				path: '/'
			},
			{
				key: 'note-list',
				title: '笔记列表',
				path: '/'
			}
		]
	}
]

@Component
export default class CreateMenu extends Vue {
	@AppModule.State(state => state.openKeys) openKeys!: Array<string>
	@AppModule.State(state => state.selectedKeys) selectedKeys!: Array<string>
	@AppModule.State(state => state.collapsed) collapsed!: boolean
	@AppModule.State(state => state.theme) theme!: string

	@AppModule.Mutation('SET_OPENKEYS') SET_OPENKEYS!: Function
	@AppModule.Mutation('SET_SELECTEKEYS') SET_SELECTEKEYS!: Function

	private menu = menu
	private MenuOpenKeys: Array<string> = []
	private MenuCatchOpenKeys: Array<string> = []
	private MenuSelectedKeys: Array<string> = []

	mounted() {
		setTimeout(() => {
			if (!this.collapsed) {
				this.MenuOpenKeys = this.openKeys
			}
			this.MenuSelectedKeys = this.selectedKeys
			this.MenuCatchOpenKeys = this.openKeys
		}, 16)
	}

	//open菜单过滤 实现始终只打开一个菜单列表
	public handelMenuOpenChenge(open: any) {
		const menu = this.menu.map(k => k.key)
		const key = open.find((key: any) => this.MenuOpenKeys.indexOf(key) === -1)
		if (menu.indexOf(key) === -1) {
			this.MenuOpenKeys = open
		} else {
			this.MenuOpenKeys = key ? [key] : []
		}
	}

	public handelMenuSelect(opts: { key: string; selectedKeys: Array<string>; keyPath: Array<string> }) {
		const { key } = opts
		this.MenuSelectedKeys = opts.selectedKeys
		this.SET_SELECTEKEYS(opts.keyPath)

		//获取此菜单的父级
		const flter = this.menu.filter(k => k.children.some(v => key === v.key))[0].key
		this.SET_OPENKEYS([flter])
		this.MenuCatchOpenKeys = [flter]
	}

	@Watch('collapsed', { immediate: true })
	ChangeCollapsed() {
		if (this.collapsed) {
			this.MenuCatchOpenKeys = this.MenuOpenKeys
			this.MenuOpenKeys = []
		} else {
			this.MenuOpenKeys = this.MenuCatchOpenKeys
		}
	}

	render() {
		return (
			<Menu
				theme={this.theme}
				mode="inline"
				style={{lineHeight: '64px'}}
				openKeys={this.MenuOpenKeys}
				selectedKeys={this.MenuSelectedKeys}
				onOpenChange={this.handelMenuOpenChenge}
				onSelect={this.handelMenuSelect}
			>
				{this.menu.map(ele => (
					<Menu.SubMenu key={ele.key}>
						<span slot="title">
							<Icon type={ele.icon} />
							<span>{ele.title}</span>
						</span>
						{ele.children.map(chil => (
							<Menu.Item key={chil.key}>
								<router-link to={chil.path}>{chil.title}</router-link>
							</Menu.Item>
						))}
					</Menu.SubMenu>
				))}
			</Menu>
		)
	}
}

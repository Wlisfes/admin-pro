/*
 * @Author: 情雨随风
 * @Date: 2020-03-28 18:09:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 22:13:06
 * @Description: 菜单组件
 */

import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Menu, Icon } from 'ant-design-vue'

const AppModule = namespace('app')

const menu = [
	{
		key: 'home',
		icon: 'dashboard',
		title: '控制台',
		children: [
			{
				key: 'home',
				title: '首页',
				path: '/'
			}
		]
	},
	{
		key: 'admin',
		icon: 'user',
		title: '管理中心',
		children: [
			{
				key: 'admin-user',
				title: '用户管理',
				path: '/admin/user'
			},
			{
				key: 'admin-role',
				title: '角色管理',
				path: '/admin/role'
			},
			{
				key: 'admin-auth',
				title: '权限管理',
				path: '/admin/auth'
			}
		]
	},
	{
		key: 'label',
		icon: 'yuque',
		title: '标签页',
		children: [
			{
				key: 'label',
				title: '标签列表',
				path: '/label/list'
			}
		]
	},
	{
		key: 'article',
		icon: 'read',
		title: '文章页',
		children: [
			{
				key: 'article-list',
				title: '文章列表',
				path: '/article/list'
			},
			{
				key: 'article-create',
				title: '新增文章',
				path: '/article/create'
			}
		]
	},
	{
		key: 'notes',
		icon: 'schedule',
		title: '笔记页',
		children: [
			{
				key: 'notes-list',
				title: '笔记列表',
				path: '/notes/list'
			},
			{
				key: 'notes-create',
				title: '新增笔记',
				path: '/notes/create'
			}
		]
	},
	{
		key: 'project',
		icon: 'profile',
		title: '项目页',
		children: [
			{
				key: 'profile-list',
				title: '项目列表',
				path: '/project/list'
			}
		]
	},
	{
		key: 'center',
		icon: 'setting',
		title: '设置中心',
		children: [
			{
				key: 'user-center',
				title: '个人中心',
				path: '/user/center'
			},
			{
				key: 'user-setting',
				title: '个人设置',
				path: '/user/setting'
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

	@Emit('menuClick')
	menuClick() {}

	render() {
		return (
			<Menu
				theme={this.theme}
				mode="inline"
				style={{ lineHeight: '64px' }}
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
							<Menu.Item key={chil.key} onClick={this.menuClick}>
								<router-link to={chil.path}>{chil.title}</router-link>
							</Menu.Item>
						))}
					</Menu.SubMenu>
				))}
			</Menu>
		)
	}
}

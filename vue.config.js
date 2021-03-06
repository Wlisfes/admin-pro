const path = require('path')
const createThemeColorReplacerPlugin = require('./themeColor/themeColorReplacer')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
	assetsDir: 'static',
	productionSourceMap: false,
	chainWebpack: config => {
		config.resolve.alias //配置别名
			.set('@', resolve('src'))

		config.plugins.delete('preload') //删除预加载
		config.plugins.delete('prefetch') //移除 preload 插件
		config.optimization.minimize(true) //压缩代码
		config.optimization.splitChunks({
			//分割代码
			chunks: 'all'
		})
	},
	configureWebpack: config => {
		config.plugins.push(createThemeColorReplacerPlugin())
		if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
			config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
			config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
				'console.log',
				'console.error'
			]
		}
	},
	css: {
		loaderOptions: {
			less: {
				// modifyVars: {
				// 	'primary-color': '#1890FF'
				// },
				javascriptEnabled: true
			}
		},
		requireModuleExtension: true
	},
	lintOnSave: false,
	devServer: {
		port: 8087,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3003',
				ws: false,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
}

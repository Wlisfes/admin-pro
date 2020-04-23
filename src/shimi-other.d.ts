declare module '*.less' {
	const less: any
	export default less
}
declare module '*.module.less' {
	const less: { [key: string]: any }
	export default less
}
declare module '*.svg' {
	const svg: any
	export default svg
}
declare module '*.png' {
	const png: any
	export default png
}
declare module '*.jpg' {
	const png: any
	export default jpg
}
declare module '*.gif' {
	const png: any
	export default gif
}

declare module 'vue-cropper' {
	const VueCropper: any
	export { VueCropper }
}

declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
	const zh_CN: any
	export default zh_CN
}

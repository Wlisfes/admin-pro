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
	const jpg: any
	export default jpg
}
declare module '*.gif' {
	const gif: any
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

declare module 'element-ui/lib/button' {
	import { ElButton } from 'element-ui/types/button'
	class B extends ElButton {}
	export default B
}
declare module 'element-ui/lib/input' {
	import { ElInput } from 'element-ui/types/input'
	class I extends ElInput {}
	export default I
}
declare module 'element-ui/lib/color-picker' {
	import { ElColorPicker } from 'element-ui/types/color-picker'
	class ColorPicker extends ElColorPicker {}
	export default ColorPicker
}
declare module 'vue-meditor' {
	import { Vue } from 'vue-property-decorator'
	class Meditor extends Vue {}
	export default Meditor
}

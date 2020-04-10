/*
 * @Author: 情雨随风
 * @Date: 2020-04-09 19:54:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 23:28:43
 * @Description: 头像裁剪组件
 */

import '../less/avaterUpload.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Modal, Row, Col, Upload, Button } from 'ant-design-vue'
import { VueCropper } from 'vue-cropper'
import { upload } from '@/api'
import { VueCropperOptions } from '@/interface'

@Component
export default class AvaterUpload extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop(String) id!: string

	private centered: boolean = true
	private width: number = 800
	private destroyOnClose: boolean = true
	private maskClosable: boolean = false
	private loading: boolean = false

	private previews: any = {
		url: '',
		img: {},
		name: ''
	}

	private vueCropperOptions: VueCropperOptions = {
		img: '',
		autoCrop: true,
		autoCropWidth: 240,
		autoCropHeight: 240,
		fixedBox: true,
		info: true
	}

	//获取裁剪框实例
	get cropper() {
		return this.$refs.cropper as any
	}

	//放大 or 缩小
	public changeScale(num: number) {
		this.cropper.changeScale(num)
	}

	//旋转
	public rotate(key: string) {
		this.cropper[key]()
	}

	public onBeforeUpload(file: File) {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			this.previews.name = file.name
			this.vueCropperOptions.img = reader.result as string
		}
		return false
	}

	//上传
	public onSubmit() {
		this.loading = true
		const formData = new FormData()
		this.cropper.getCropBlob(async (data: any) => {
			formData.append('file', data, this.previews.name)
			const response = await upload(formData)

			this.$emit('submit', {
				id: this.id,
				response: response
			})
		})
	}

	render() {
		return (
			<Modal
				title="头像修改"
				visible={this.visible}
				centered={this.centered}
				width={this.width}
				footer={null}
				maskClosable={this.maskClosable}
				destroyOnClose={this.destroyOnClose}
				onCancel={() => {
					this.$emit('cancel')
				}}
			>
				<div class="avater-modal">
					<div class="avater-modal-cropper">
						<div class="avater-modal-container">
							<div>
								<VueCropper
									ref="cropper"
									mode="cover"
									img={this.vueCropperOptions.img}
									info={this.vueCropperOptions.info}
									autoCrop={this.vueCropperOptions.autoCrop}
									autoCropWidth={this.vueCropperOptions.autoCropWidth}
									autoCropHeight={this.vueCropperOptions.autoCropHeight}
									fixedBox={this.vueCropperOptions.fixedBox}
									onRealTime={(data: { img: any; url: string }) => {
										this.previews.url = data.url
										this.previews.img = data.img
									}}
								></VueCropper>
							</div>
						</div>
						<div class="avater-modal-container">
							<div>
								<div class="previews">
									{this.previews.url && (
										<img
											src={this.previews.url}
											style={{
												height: '100%',
												width: '100%',
												display: 'block',
												...this.previews.img
											}}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					<div class="avater-modal-footer">
						<div>
							<Upload name="file" showUploadList={false} beforeUpload={this.onBeforeUpload}>
								<Button icon="upload">选择图片</Button>
							</Upload>
						</div>
						<div>
							<Button icon="plus" onClick={() => this.changeScale(1)} />
						</div>
						<div>
							<Button icon="minus" onClick={() => this.changeScale(-1)} />
						</div>
						<div>
							<Button icon="undo" onClick={() => this.rotate('rotateLeft')} />
						</div>
						<div>
							<Button icon="redo" onClick={() => this.rotate('rotateRight')} />
						</div>
						<div>
							<Button type="primary" loading={this.loading} onClick={this.onSubmit}>
								上传
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

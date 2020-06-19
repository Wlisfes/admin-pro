/*
 * @Author: 情雨随风
 * @Date: 2020-04-09 19:54:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-09 22:50:01
 * @Description: 头像裁剪组件
 */

import './less/common.avater.less'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Modal, Upload, Button } from 'ant-design-vue'
import { VueCropper } from 'vue-cropper'
import { uploadFile } from '@/api'

@Component
export default class AvaterUpload extends Vue {
	@Prop(Boolean) visible!: boolean
	@Prop() uid!: number | string
	@Prop({ default: '头像修改' }) title!: string
	@Prop({ default: '' }) picUrl!: string

	private centered: boolean = true
	private width: number = 800
	private destroyOnClose: boolean = false
	private maskClosable: boolean = false
	private loading: boolean = false

	private previews: any = {
		url: '',
		img: {},
		name: ''
	}

	private vueCropperOptions = {
		img: '',
		autoCrop: true,
		autoCropWidth: 240,
		autoCropHeight: 240,
		fixedBox: true,
		canMoveBox: false,
		centerBox: true,
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

	//Upload组件生命周期 获取图片信息
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
			const response = await uploadFile(formData)

			this.$emit('submit', {
				uid: this.uid,
				response: response,
				timeout: () => {
					setTimeout(() => {
						this.vueCropperOptions.img = ''
						this.previews.url = ''
						this.previews.img = {}
						this.previews.name = ''
						this.loading = false
					}, 500)
				}
			})
		})
	}

	render() {
		return (
			<Modal
				title={this.title}
				visible={this.visible}
				centered={this.centered}
				width={this.width}
				footer={null}
				maskClosable={this.maskClosable}
				destroyOnClose={this.destroyOnClose}
				onCancel={() => {
					this.$emit('cancel')
					this.vueCropperOptions.img = ''
					this.previews.url = ''
					this.previews.img = {}
					this.previews.name = ''
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
									canMoveBox={this.vueCropperOptions.canMoveBox}
									centerBox={this.vueCropperOptions.centerBox}
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
									{(this.previews.url || this.picUrl) && (
										<img
											src={this.previews.url || this.picUrl}
											style={
												this.previews.url
													? this.previews.img
													: {
															height: '100%',
															width: '100%',
															display: 'block',
															borderRadius: '50%'
													  }
											}
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
							<Button
								icon="plus"
								disabled={!this.vueCropperOptions.img}
								onClick={() => this.changeScale(1)}
							/>
						</div>
						<div>
							<Button
								icon="minus"
								disabled={!this.vueCropperOptions.img}
								onClick={() => this.changeScale(-1)}
							/>
						</div>
						<div>
							<Button
								icon="undo"
								disabled={!this.vueCropperOptions.img}
								onClick={() => this.rotate('rotateLeft')}
							/>
						</div>
						<div>
							<Button
								icon="redo"
								disabled={!this.vueCropperOptions.img}
								onClick={() => this.rotate('rotateRight')}
							/>
						</div>
						<div>
							<Button
								type="primary"
								loading={this.loading}
								onClick={this.onSubmit}
								disabled={!this.vueCropperOptions.img}
							>
								上传
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

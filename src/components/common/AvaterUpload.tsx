/*
 * @Author: 情雨随风
 * @Date: 2020-04-09 19:54:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-09 23:28:43
 * @Description: 头像裁剪组件
 */

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
				<Row>
					<Col xs={24} md={12} style={{ height: '350px' }}>
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
					</Col>
					<Col xs={24} md={12} style={{ height: '350px' }}>
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: '240px',
								height: '240px',
								borderRadius: '50%',
								boxShadow: '0 0 4px #ccc',
								overflow: 'hidden'
							}}
						>
							{this.previews.url && (
								<img
									src={this.previews.url}
									style={{ height: '100%', width: '100%', display: 'block', ...this.previews.img }}
								/>
							)}
						</div>
					</Col>
				</Row>
				<Row style={{ marginTop: '24px' }}>
					<Col lg={2} md={2}>
						<Upload name="file" showUploadList={false} beforeUpload={this.onBeforeUpload}>
							<Button icon="upload">选择图片</Button>
						</Upload>
					</Col>
					<Col lg={{ span: 1, offset: 2 }} md={2}>
						<Button icon="plus" onClick={() => this.changeScale(1)} />
					</Col>
					<Col lg={{ span: 1, offset: 1 }} md={2}>
						<Button icon="minus" onClick={() => this.changeScale(-1)} />
					</Col>
					<Col lg={{ span: 1, offset: 1 }} md={2}>
						<Button icon="undo" onClick={() => this.rotate('rotateLeft')} />
					</Col>
					<Col lg={{ span: 1, offset: 1 }} md={2}>
						<Button icon="redo" onClick={() => this.rotate('rotateRight')} />
					</Col>
					<Col lg={{ span: 2, offset: 6 }} md={2}>
						<Button type="primary" loading={this.loading} onClick={this.onSubmit}>
							上传
						</Button>
					</Col>
				</Row>
			</Modal>
		)
	}
}

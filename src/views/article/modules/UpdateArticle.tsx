/*
 * @Author: 情雨随风
 * @Date: 2020-06-20 23:29:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-20 23:50:37
 * @Description: 修改文章
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { ArticleForm } from './index'
import { Modal } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'

@Component
export default class UpdateArticle extends Vue {
	@Prop() visible!: false
	@Prop() id!: number

	private modal = {
		...CommonModal,
		width: 1440,
		title: '修改文章'
	}

	public onSubmit() {
		this.modal.loading = true
	}

	public onCancel() {
		this.$emit('cancel')
		this.modal.loading = false
	}

	protected render() {
		return (
			<Modal
				getContainer={() => document.querySelector('.root-article')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
				// okButtonProps={{ props: { disabled: this.update.loading } }}
				footer={null}
				onCancel={this.onCancel}
				onOk={this.onSubmit}
			></Modal>
		)
	}
}

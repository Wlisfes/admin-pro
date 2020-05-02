/*
 * @Author: 情雨随风
 * @Date: 2020-04-28 22:04:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-28 22:08:42
 * @Description: 修改用户信息
 */

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form, Input, Modal, Checkbox, Radio } from 'ant-design-vue'
import { CommonModal } from '@/interface/common'

@Component({
	props: { form: { type: Object } }
})
class UpdateUserModal extends Vue {
	@Prop(Boolean) visible!: false

	private modal = {
		...CommonModal,
		title: '编辑用户'
	}

	render() {
		return (
			<Modal
				getContainer={() => document.querySelector('.admin-role')}
				visible={this.visible}
				title={this.modal.title}
				centered={this.modal.centered}
				width={this.modal.width}
				okText={this.modal.okText}
				cancelText={this.modal.cancelText}
				confirmLoading={this.modal.loading}
				destroyOnClose={this.modal.destroyOnClose}
			></Modal>
		)
	}
}
export default Form.create({})(UpdateUserModal)

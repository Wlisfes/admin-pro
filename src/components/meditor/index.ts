export { default as Preview } from './preview'
export { default as Meditor } from './meditor'

//创建文件读取
export function createFile(): Promise<FormData> {
	return new Promise(resolve => {
		const Input = document.createElement('input')
		Input.setAttribute('type', 'file')
		Input.setAttribute('accept', 'image/gif,image/jpeg,image/jpg,image/png,image/svg')

		Input.click()
		Input.addEventListener(
			'change',
			(e: any) => {
				const file = e.target.files[0]
				const formData = new FormData()
				formData.append('file', file, file.name)
				resolve(formData)
			},
			false
		)
	})
}

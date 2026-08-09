import { useState } from 'react'
import Modal from '../shared/Modal'

export default function TaskFormModal({
	mode,
	initialValues,
	sections,
	onSubmit,
	onClose
}) {
	const [form, setForm] = useState(initialValues)
	const [errors, setErrors] = useState({})
	const [generalError, setGeneralError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setErrors({})
		setGeneralError('')
		const res = await onSubmit(form)
		if (!res.success) {
			if (res.errors) {
				setErrors(res.errors)
			} else {
				setGeneralError(res.message || 'Something went wrong.')
			}
		}
	}

	const title = mode === 'create' ? 'Add Task' : 'Edit Task'
	const submitLabel = mode === 'create' ? 'Add Task' : 'Save Changes'

	return (
		<Modal>
			<h3>{title}</h3>
			{generalError && <div className="error-general">{generalError}</div>}
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
				<div className="form-item">
					<label htmlFor="task_title">Title</label>
					<input
						id="task_title"
						type="text"
						placeholder="e.g. Verify Article 1"
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						required
					/>
					{errors.title && <span className="error-text">{errors.title[0]}</span>}
				</div>
				<div className="form-item">
					<label htmlFor="task_target_media_url">Target Media URL</label>
					<input
						id="task_target_media_url"
						type="url"
						placeholder="https://..."
						value={form.target_media_url}
						onChange={(e) => setForm({ ...form, target_media_url: e.target.value })}
						required
					/>
					{errors.target_media_url && <span className="error-text">{errors.target_media_url[0]}</span>}
				</div>

				<div className="form-item">
					<label htmlFor="task_section_id">Classroom Section</label>
					<select
						id="task_section_id"
						value={form.section_id}
						onChange={(e) => setForm({ ...form, section_id: e.target.value })}
						required
					>
						<option value="">-- Select Section --</option>
						{sections.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name} ({s.code})
							</option>
						))}
					</select>
					{errors.section_id && (
						<span className="error-text">{errors.section_id[0]}</span>
					)}
				</div>
				<div className="modal-actions">
					<button type="button" className="btn-modal-cancel" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn-modal-submit">
						{submitLabel}
					</button>
				</div>
			</form>
		</Modal>
	)
}

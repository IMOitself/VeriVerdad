import { useState } from 'react'
import Modal from '../shared/Modal'

export default function BadgeFormModal({
	mode,
	initialValues,
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

	const title = mode === 'create' ? 'Add Badge' : 'Edit Badge'
	const submitLabel = mode === 'create' ? 'Add Badge' : 'Save Changes'

	return (
		<Modal>
			<h3>{title}</h3>
			{generalError && <div className="error-general">{generalError}</div>}
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
				<div className="form-item">
					<label htmlFor="badge_name">Name</label>
					<input
						id="badge_name"
						type="text"
						placeholder="e.g. Master Verifier"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
					{errors.name && <span className="error-text">{errors.name[0]}</span>}
				</div>
				<div className="form-item">
					<label htmlFor="badge_description">Description</label>
					<textarea
						id="badge_description"
						placeholder="Badge description..."
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						required
						rows={3}
					/>
					{errors.description && <span className="error-text">{errors.description[0]}</span>}
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

import { useState } from 'react'
import Modal from '../shared/Modal'

export default function SectionFormModal({
	mode,
	initialValues,
	teachers,
	role,
	currentUsername,
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

	const title = mode === 'create' ? 'Add Classroom' : 'Edit Classroom'
	const submitLabel = mode === 'create' ? 'Add Classroom' : 'Save Changes'

	return (
		<Modal>
			<h3>{title}</h3>
			{generalError && <div className="error-general">{generalError}</div>}
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
				<div className="form-item">
					<label htmlFor="sec_name">Classroom Name</label>
					<input
						id="sec_name"
						type="text"
						placeholder="e.g. 10 - Rizal"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
					{errors.name && <span className="error-text">{errors.name[0]}</span>}
				</div>
				<div className="form-item">
					<label htmlFor="sec_code">Section Code</label>
					<input
						id="sec_code"
						type="text"
						placeholder="e.g. 10-RIZAL"
						value={form.code}
						onChange={(e) => setForm({ ...form, code: e.target.value })}
						required
					/>
					{errors.code && <span className="error-text">{errors.code[0]}</span>}
				</div>
				{role === 'admin' ? (
					<div className="form-item">
						<label htmlFor="sec_teacher">Assigned Teacher</label>
						<select
							id="sec_teacher"
							value={form.teacher_id}
							onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
							required
						>
							<option value="">-- Select Instructor --</option>
							{teachers.map((t) => (
								<option key={t.id} value={t.id}>
									{t.username} ({t.email})
								</option>
							))}
						</select>
						{errors.teacher_id && (
							<span className="error-text">{errors.teacher_id[0]}</span>
						)}
					</div>
				) : (
					<div className="form-item">
						<label>Teacher Assignment</label>
						<input
							type="text"
							value={`${currentUsername || 'You'} (Instructor)`}
							disabled
						/>
					</div>
				)}
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
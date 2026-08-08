import { useState } from 'react'
import Modal from '../shared/Modal'

export default function UserFormModal({
	mode,
	initialValues,
	sections,
	onSubmit,
	onClose
}) {
	const [form, setForm] = useState(
		initialValues || {
			username: '',
			email: '',
			password: '',
			role: 'student',
			section_id: '',
			new_password: '',
			new_password_confirmation: ''
		}
	)
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
				setGeneralError(res.message || res.error || 'Something went wrong.')
			}
		}
	}

	const title = mode === 'create' ? 'Add New User' : 'Edit User'
	const submitLabel = mode === 'create' ? 'Create User' : 'Save Changes'

	return (
		<Modal>
			<h3>{title}</h3>
			{generalError && <div className="error-general">{generalError}</div>}
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
				<div className="form-item">
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						value={form.username}
						onChange={(e) => setForm({ ...form, username: e.target.value })}
						required
					/>
					{errors.username && <span className="error-text">{errors.username[0]}</span>}
				</div>

				<div className="form-item">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
					{errors.email && <span className="error-text">{errors.email[0]}</span>}
				</div>

				{mode === 'create' && (
					<div className="form-item">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							placeholder="••••••••"
							required
						/>
						{errors.password && <span className="error-text">{errors.password[0]}</span>}
					</div>
				)}

				<div className="form-item">
					<label htmlFor="role">Role</label>
					<select
						id="role"
						value={form.role}
						onChange={(e) => setForm({ ...form, role: e.target.value })}
					>
						<option value="student">Student</option>
						<option value="teacher">Teacher</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				{form.role === 'student' && (
					<div className="form-item">
						<label htmlFor="section_id">Classroom Section</label>
						<select
							id="section_id"
							value={form.section_id}
							onChange={(e) => setForm({ ...form, section_id: e.target.value })}
						>
							<option value="">
								{mode === 'create' ? '-- Select Classroom Section --' : '-- No Section Assigned --'}
							</option>
							{sections.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name} ({s.code})
								</option>
							))}
						</select>
					</div>
				)}

				{mode === 'edit' && (
					<>
						<hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
						<h3>Change User Password</h3>

						<div className="form-item">
							<label htmlFor="new_password">New Password</label>
							<input
								id="new_password"
								type="password"
								value={form.new_password || ''}
								onChange={(e) => setForm({ ...form, new_password: e.target.value })}
								placeholder="••••••••"
							/>
						</div>

						<div className="form-item">
							<label htmlFor="new_password_confirmation">Re-type New Password</label>
							<input
								id="new_password_confirmation"
								type="password"
								value={form.new_password_confirmation || ''}
								onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
								placeholder="••••••••"
							/>
						</div>
					</>
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

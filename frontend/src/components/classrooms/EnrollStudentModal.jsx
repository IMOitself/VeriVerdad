import { useState } from 'react'
import Modal from '../shared/Modal'
import './EnrollStudentModal.css'

export default function EnrollStudentModal({
	sectionName,
	candidates,
	onEnroll,
	onClose
}) {
	const [search, setSearch] = useState('')
	const [enrollingId, setEnrollingId] = useState(null)

	const filtered = candidates.filter((c) => {
		if (!search.trim()) return true
		const q = search.toLowerCase()
		return (
			c.username?.toLowerCase().includes(q) ||
			c.email?.toLowerCase().includes(q)
		)
	})

	async function handleEnroll(id) {
		setEnrollingId(id)
		await onEnroll(id)
		setEnrollingId(null)
	}

	return (
		<Modal size="md">
			<div className="modal-header">
				<div>
					<h3>Add Students</h3>
					<p>Assign students to {sectionName}</p>
				</div>
				<button className="btn-close-text" onClick={onClose}>
					Close
				</button>
			</div>
			<div className="modal-search-field">
				<input
					type="text"
					placeholder="Search student by name or email..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					autoFocus
				/>
			</div>
			<div className="modal-candidate-list">
				{filtered.length > 0 ? (
					filtered.map((cand) => {
						const currentSec = cand.section ? cand.section.name : null
						const isEnrolling = enrollingId === cand.id
						return (
							<div key={cand.id} className="candidate-card-row">
								<div className="candidate-details">
									<div className="avatar-circle sm">
										{cand.username.charAt(0).toUpperCase()}
									</div>
									<div>
										<div className="cand-name">{cand.username}</div>
										<div className="cand-email">{cand.email}</div>
									</div>
								</div>
								<div className="candidate-assignment">
									{currentSec ? (
										<span className="tag-current-sec">In: {currentSec}</span>
									) : (
										<span className="tag-unassigned">Unassigned</span>
									)}
								</div>
								<button
									className="btn-enroll-cand"
									disabled={isEnrolling}
									onClick={() => handleEnroll(cand.id)}
								>
									{isEnrolling ? 'Adding...' : 'Add'}
								</button>
							</div>
						)
					})
				) : (
					<div className="candidate-empty">
						<p>No available students found.</p>
					</div>
				)}
			</div>
			<div className="modal-actions">
				<button type="button" className="btn-modal-close" onClick={onClose}>
					Done
				</button>
			</div>
		</Modal>
	)
}
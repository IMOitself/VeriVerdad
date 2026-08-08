import { useState, useEffect, useRef } from 'react'
import { Chevron } from '../shared/icons'
import './ClassroomSelector.css'

export default function ClassroomSelector({
	sections,
	activeSection,
	onSelectSection,
	onCopyCode,
	copyCodeSuccess,
	role,
	userId,
	onEdit,
	onDelete,
	onCreate
}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef(null)

	useEffect(function () {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return function () {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const canDelete =
		activeSection &&
		(role === 'admin' ||
			userId === (activeSection.teacher_id || activeSection.teacher?.id))

	return (
		<div className="classrooms-control-card">
			<div className="classrooms-dropdown-group" ref={dropdownRef}>
				<span className="dropdown-field-label">Classroom</span>
				<div className="custom-dropdown-container">
					<button
						type="button"
						className="custom-dropdown-trigger"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						disabled={sections.length === 0}
					>
						<span className="selected-section-name">
							{activeSection
								? `${activeSection.name} (${activeSection.code})`
								: 'No classrooms created yet'}
						</span>
						<span className="custom-dropdown-chevron">
							<Chevron open={isDropdownOpen} />
						</span>
					</button>
					{isDropdownOpen && sections.length > 0 && (
						<div className="custom-dropdown-menu">
							{sections.map((sec) => (
								<button
									key={sec.id}
									type="button"
									className={`custom-dropdown-option ${sec.id === (activeSection ? activeSection.id : null) ? 'active' : ''
										}`}
									onClick={() => {
										onSelectSection(sec.id)
										setIsDropdownOpen(false)
									}}
								>
									<span className="option-name">{sec.name}</span>
									<span className="option-code">{sec.code}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{activeSection && (
				<div className="classrooms-quick-stats">
					<button
						className="quick-code-btn"
						onClick={() => onCopyCode(activeSection.code)}
						title="Click to copy section code"
					>
						<span className="code-label">Code:</span>
						<code>{activeSection.code}</code>
						{copyCodeSuccess && <span className="tooltip-tag">Copied!</span>}
					</button>
					<div className="quick-info-tag">
						<span className="info-label">Instructor:</span>
						<span className="info-value">
							{activeSection.teacher ? activeSection.teacher.username : 'Unassigned'}
						</span>
					</div>
				</div>
			)}

			<div className="classrooms-top-actions">
				{activeSection && (
					<button className="btn-outline-action" onClick={() => onEdit(activeSection)}>
						Edit
					</button>
				)}
				{canDelete && (
					<button className="btn-danger-outline" onClick={() => onDelete(activeSection)}>
						Delete
					</button>
				)}
				<button className="btn-primary-action" onClick={onCreate}>
					Add Classroom
				</button>
			</div>
		</div>
	)
}
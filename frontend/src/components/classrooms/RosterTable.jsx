import { useState, useEffect } from 'react'
import Pagination from '../shared/Pagination'
import './RosterTable.css'

const ROSTER_PER_PAGE = 6

export default function RosterTable({
	sectionName,
	students,
	onAddStudent,
	onRemoveStudent
}) {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)

	useEffect(
		function () {
			setPage(1)
		},
		[search, students.length]
	)

	const filtered = students.filter(
		(s) =>
			s.username?.toLowerCase().includes(search.toLowerCase()) ||
			s.email?.toLowerCase().includes(search.toLowerCase())
	)
	const totalPages = Math.ceil(filtered.length / ROSTER_PER_PAGE) || 1
	const startIdx = (page - 1) * ROSTER_PER_PAGE
	const pageItems = filtered.slice(startIdx, startIdx + ROSTER_PER_PAGE)

	return (
		<div className="roster-card">
			<div className="roster-header-bar">
				<div>
					<div className="roster-title-box">
						<h3 className="roster-title">{sectionName || 'Classroom Roster'}</h3>
						<span className="roster-count-badge">
							{students.length} student{students.length === 1 ? '' : 's'} enrolled
						</span>
					</div>
					<p className="roster-subtitle">
						Manage enrolled students and view their progress
					</p>
				</div>
				<div className="roster-controls">
					<input
						className="roster-search-input"
						type="text"
						placeholder="Search students..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button className="btn-enroll-primary" onClick={onAddStudent}>
						Add Student
					</button>
				</div>
			</div>

			<div className="roster-table-container">
				<table className="classrooms-table">
					<thead>
						<tr>
							<th>Student</th>
							<th>Email Address</th>
							<th>CRAAP Badges</th>
							<th>Status</th>
							<th className="text-right">Action</th>
						</tr>
					</thead>
					<tbody>
						{pageItems.length > 0 ? (
							pageItems.map((student) => (
								<tr key={student.id}>
									<td className="cell-student">
										<div className="avatar-circle">
											{student.username.charAt(0).toUpperCase()}
										</div>
										<span className="student-name">{student.username}</span>
									</td>
									<td className="cell-muted">{student.email}</td>
									<td>
										<div className="badge-pill-group">
											{student.badges && student.badges.length > 0 ? (
												student.badges.slice(0, 3).map((b) => (
													<span key={b.id} className="badge-tag" title={b.name}>
														{b.name}
													</span>
												))
											) : (
												<span className="badge-empty-tag">No badges</span>
											)}
											{student.badges && student.badges.length > 3 && (
												<span className="badge-more-tag">
													+{student.badges.length - 3}
												</span>
											)}
										</div>
									</td>
									<td>
										<span className="status-badge-active">Enrolled</span>
									</td>
									<td className="text-right">
										<button
											className="btn-remove-row"
											onClick={() => onRemoveStudent(student)}
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="5" className="cell-empty-state">
									{search ? (
										<p>No students match your search.</p>
									) : (
										<div className="empty-roster-action">
											<p>No students enrolled in this classroom yet.</p>
											<button className="btn-enroll-empty" onClick={onAddStudent}>
												Add Student
											</button>
										</div>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={ROSTER_PER_PAGE} itemLabel="students" />
		</div>
	)
}
import { useState, useEffect } from 'react'
import Pagination from '../shared/Pagination'
import './ClassroomAuditTable.css'

const ITEMS_PER_PAGE = 10

export default function ClassroomAuditTable({ students = [] }) {
	const [currentPage, setCurrentPage] = useState(1)
	const totalPages = Math.max(1, Math.ceil(students.length / ITEMS_PER_PAGE))

	useEffect(
		function () {
			setCurrentPage(1)
		},
		[students.length]
	)

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
	const currentStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE)

	return (
		<div className="audit-card">
			<div className="audit-header">
				<div>
					<h3>Classroom Verification Audit Roster</h3>
					<p className="audit-subtitle">
						Active student enrollment, assigned sections, and media literacy
						badges
					</p>
				</div>
				<div className="audit-roster-count">
					<span>
						Total: <strong>{students.length}</strong> Students
					</span>
				</div>
			</div>
			<div className="audit-table-container">
				<table className="audit-table">
					<thead>
						<tr>
							<th>Student</th>
							<th>Email</th>
							<th>Classroom Section</th>
							<th>Badges Earned</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{currentStudents.length > 0 ? (
							currentStudents.map(function (student) {
								return (
									<tr key={student.id}>
										<td className="student-name">{student.username}</td>
										<td className="student-email">{student.email}</td>
										<td>
											{student.section ? (
												<span className="audit-section-badge">
													{student.section.name} ({student.section.code})
												</span>
											) : (
												<span className="audit-unassigned-badge">
													Unassigned
												</span>
											)}
										</td>
										<td>
											<div className="badges-list-cell">
												{student.badges && student.badges.length > 0 ? (
													student.badges.map((b) => (
														<span
															key={b.id}
															className="badge-pill"
															title={b.description || b.name}
														>
															{b.name}
														</span>
													))
												) : (
													<span className="text-muted">No badges yet</span>
												)}
											</div>
										</td>
										<td>
											<span className="status-badge active">Enrolled</span>
										</td>
									</tr>
								)
							})
						) : (
							<tr>
								<td colSpan="5" className="audit-empty-cell">
									No student roster records found for the selected section.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<Pagination
				page={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={students.length}
				itemsPerPage={ITEMS_PER_PAGE}
				itemLabel="students"
			/>
		</div>
	)
}
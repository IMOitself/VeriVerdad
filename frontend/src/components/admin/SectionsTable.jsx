import Pagination from '../shared/Pagination'
import './AdminTable.css'
import './SectionsTable.css'

export default function SectionsTable({
	sections,
	paginatedSections,
	page,
	totalPages,
	onPageChange,
	itemsPerPage,
	onEditSection,
	onDeleteSection
}) {
	return (
		<>
			<table className="admin-table">
				<thead>
					<tr>
						<th>Section Name</th>
						<th>Section Code</th>
						<th>Assigned Teacher</th>
						<th>Students Enrolled</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{paginatedSections.length > 0 ? (
						paginatedSections.map((sec) => (
							<tr key={sec.id}>
								<td className="username-cell">{sec.name}</td>
								<td>
									<span className="section-code-pill">{sec.code}</span>
								</td>
								<td>
									{sec.teacher ? (
										<span>
											{sec.teacher.username}{' '}
											<small className="text-muted">
												({sec.teacher.email})
											</small>
										</span>
									) : (
										<span className="text-muted">Unassigned</span>
									)}
								</td>
								<td>
									<span className="students-count-badge">
										{sec.students_count ?? sec.students?.length ?? 0}{' '}
										Students
									</span>
								</td>
								<td>
									<div className="admin-actions-cell">
										<button
											className="btn-edit"
											onClick={() => onEditSection(sec)}
										>
											Edit
										</button>
										<button
											className="btn-delete"
											onClick={() => onDeleteSection(sec.id)}
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="5" className="text-center py-4">
								No classroom sections configured.
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				totalItems={sections.length}
				itemsPerPage={itemsPerPage}
				itemLabel="sections"
			/>
		</>
	)
}

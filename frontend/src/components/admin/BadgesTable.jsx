import Pagination from '../shared/Pagination'

export default function BadgesTable({
	badges,
	paginatedBadges,
	page,
	totalPages,
	onPageChange,
	itemsPerPage,
	onEditBadge,
	onDeleteBadge
}) {
	return (
		<div className="admin-table-container">
			<table className="admin-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{paginatedBadges.length > 0 ? (
						paginatedBadges.map((b) => (
							<tr key={b.id}>
								<td>{b.name}</td>
								<td>{b.description}</td>
								<td>
									<div className="table-actions">
										<button
											className="btn-edit"
											onClick={() => onEditBadge(b)}
										>
											Edit
										</button>
										<button
											className="btn-delete"
											onClick={() => onDeleteBadge(b.id)}
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
								No badges found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<Pagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	)
}

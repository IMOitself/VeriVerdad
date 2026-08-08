import Pagination from '../shared/Pagination'
import './AdminTable.css'
import './UsersTable.css'

export default function UsersTable({
	users,
	paginatedUsers,
	page,
	totalPages,
	onPageChange,
	itemsPerPage,
	onEditUser,
	onDeleteUser
}) {
	return (
		<>
			<table className="admin-table">
				<thead>
					<tr>
						<th>Username</th>
						<th>Email</th>
						<th>Role</th>
						<th>Section</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{paginatedUsers.map((user) => (
						<tr key={user.id}>
							<td className="username-cell">{user.username}</td>
							<td>{user.email}</td>
							<td>
								<span className={`role-badge ${user.role}`}>
									{user.role}
								</span>
							</td>
							<td>
								{user.section ? (
									<span className="section-badge">
										{user.section.name} ({user.section.code})
									</span>
								) : (
									<span className="text-muted">—</span>
								)}
							</td>
							<td>
								<div className="admin-actions-cell">
									<button
										className="btn-edit"
										onClick={() => onEditUser(user)}
									>
										Edit
									</button>
									<button
										className="btn-delete"
										onClick={() => onDeleteUser(user.id)}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				totalItems={users.length}
				itemsPerPage={itemsPerPage}
				itemLabel="users"
			/>
		</>
	)
}
import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser, logout } from '../api.js';
import './Admin.css';
import Sidebar from '../components/dashboard/Sidebar';
import ConfirmModal from '../components/shared/ConfirmModal';

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState('');
	const [selectedUserId, setSelectedUserId] = useState(null);

	const [editingUser, setEditingUser] = useState(null);
	const [editForm, setEditForm] = useState({ username: '', email: '', role: 'student' });
	const [editError, setEditError] = useState('');

	const currentUser = (function () {
		try {
			return JSON.parse(localStorage.getItem('user'));
		} catch (e) {
			return null;
		}
	})();

	useEffect(function () {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		const result = await getUsers();
		if (result.success && result.data) {
			setUsers(result.data);
		} else if (result.error) {
			setError(result.error);
		}
	}

	function promptDelete(id) {
		setSelectedUserId(id);
	}

	async function handleConfirmDelete() {
		if (!selectedUserId) return;

		const targetId = selectedUserId;
		setSelectedUserId(null);

		const result = await deleteUser(targetId);

		if (result.success) {
			if (currentUser && currentUser.id === targetId) {
				await logout();
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				window.location.href = '/login';
			} else {
				setUsers(users.filter(user => user.id !== targetId));
			}
		} else if (result.error) {
			setError(result.error);
		}
	}

	function openEditModal(user) {
		setEditingUser(user);
		setEditForm({
			username: user.username || '',
			email: user.email || '',
			role: user.role || 'student'
		});
		setEditError('');
	}

	function handleEditChange(e) {
		const id = e.target.id;
		const value = e.target.value;
		setEditForm(function (prev) {
			return { ...prev, [id]: value };
		});
	}

	async function handleSaveEdit(e) {
		e.preventDefault();
		if (!editingUser) return;

		setEditError('');
		const result = await updateUser(editingUser.id, editForm);

		if (result.success && result.data) {
			setUsers(users.map(u => u.id === editingUser.id ? result.data : u));
			if (currentUser && currentUser.id === editingUser.id) {
				localStorage.setItem('user', JSON.stringify(result.data));
				window.dispatchEvent(new Event('storage'));
			}
			setEditingUser(null);
		} else {
			setEditError(result.message || result.error || 'Failed to update user');
		}
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="admin-card">
					<h2>Admin Dashboard</h2>
					<p className="admin-subtitle">System User Management & Role Administration</p>

					{error && <div className="error-general">{error}</div>}

					<table className="admin-table">
						<thead>
							<tr>
								<th>Username</th>
								<th>Email</th>
								<th>Role</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id}>
									<td className="username-cell">{user.username}</td>
									<td>{user.email}</td>
									<td>
										<span className={`role-badge ${user.role}`}>
											{user.role}
										</span>
									</td>
									<td>
										<div className="admin-actions-cell">
											<button
												className="btn-edit"
												onClick={() => openEditModal(user)}
											>
												Edit
											</button>
											<button
												className="btn-delete"
												onClick={() => promptDelete(user.id)}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Edit User Modal */}
					{editingUser && (
						<div className="modal-overlay">
							<div className="modal-card">
								<h3>Edit User</h3>

								{editError && <div className="error-general">{editError}</div>}

								<form className="edit-modal-form" onSubmit={handleSaveEdit}>
									<div className="form-group">
										<label htmlFor="username">Username</label>
										<input
											id="username"
											type="text"
											value={editForm.username}
											onChange={handleEditChange}
											required
										/>
									</div>

									<div className="form-group">
										<label htmlFor="email">Email</label>
										<input
											id="email"
											type="email"
											value={editForm.email}
											onChange={handleEditChange}
											required
										/>
									</div>

									<div className="form-group">
										<label htmlFor="role">Role</label>
										<select
											id="role"
											value={editForm.role}
											onChange={handleEditChange}
										>
											<option value="student">Student</option>
											<option value="teacher">Teacher</option>
											<option value="admin">Admin</option>
										</select>
									</div>

									<div className="modal-actions">
										<button
											type="button"
											className="btn-modal-cancel"
											onClick={() => setEditingUser(null)}
										>
											Cancel
										</button>
										<button type="submit" className="btn-modal-save">
											Save Changes
										</button>
									</div>
								</form>
							</div>
						</div>
					)}

					<ConfirmModal
						isOpen={selectedUserId !== null}
						title="Are you sure?"
						message="Are you sure you want to delete this user account? This action cannot be undone."
						onConfirm={handleConfirmDelete}
						onCancel={() => setSelectedUserId(null)}
					/>
				</div>
			</div>
		</div>
	);
}

import { useState, useEffect } from 'react';
import { getUsers, register, updateUser, deleteUser, logout } from '../api.js';
import './Admin.css';
import Sidebar from '../components/dashboard/Sidebar';
import ConfirmModal from '../components/shared/ConfirmModal';

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState('');
	const [selectedUserId, setSelectedUserId] = useState(null);

	const [editingUser, setEditingUser] = useState(null);
	const [editForm, setEditForm] = useState({ username: '', email: '', role: 'student', new_password: '', new_password_confirmation: '' });
	const [editError, setEditError] = useState('');
	const [editFieldErrors, setEditFieldErrors] = useState({});

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [addForm, setAddForm] = useState({ username: '', email: '', password: '', role: 'student' });
	const [addError, setAddError] = useState('');
	const [addFieldErrors, setAddFieldErrors] = useState({});

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
			role: user.role || 'student',
			new_password: '',
			new_password_confirmation: ''
		});
		setEditError('');
		setEditFieldErrors({});
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
		setEditFieldErrors({});

		const payload = {};
		if (editForm.username) payload.username = editForm.username;
		if (editForm.email) payload.email = editForm.email;
		if (editForm.role) payload.role = editForm.role;
		if (editForm.new_password) {
			payload.new_password = editForm.new_password;
			payload.new_password_confirmation = editForm.new_password_confirmation;
		}

		const result = await updateUser(editingUser.id, payload);

		if (result.success && result.data) {
			setUsers(users.map(u => u.id === editingUser.id ? result.data : u));
			if (currentUser && currentUser.id === editingUser.id) {
				localStorage.setItem('user', JSON.stringify(result.data));
				window.dispatchEvent(new Event('storage'));
			}
			setEditingUser(null);
		} else {
			if (result.errors) {
				setEditFieldErrors(result.errors);
			} else {
				setEditError(result.message || result.error || 'Failed to update user');
			}
		}
	}

	function handleAddChange(e) {
		const id = e.target.id;
		const value = e.target.value;
		setAddForm(function (prev) {
			return { ...prev, [id]: value };
		});
	}

	async function handleAddUser(e) {
		e.preventDefault();
		setAddError('');
		setAddFieldErrors({});

		const result = await register(addForm);

		if (result.success) {
			setIsAddModalOpen(false);
			setAddForm({ username: '', email: '', password: '', role: 'student' });
			fetchUsers();
		} else {
			if (result.errors) {
				setAddFieldErrors(result.errors);
			} else {
				setAddError(result.message || result.error || 'Failed to add user');
			}
		}
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="admin-card">
					<div className="admin-header-row">
						<div>
							<h2>Admin Dashboard</h2>
							<p className="admin-subtitle">System User Management & Role Administration</p>
						</div>
						<button
							className="btn-add-user"
							onClick={() => {
								setIsAddModalOpen(true);
								setAddError('');
								setAddFieldErrors({});
							}}
						>
							Add User
						</button>
					</div>

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

					{/* Add User Modal */}
					{isAddModalOpen && (
						<div className="modal-overlay">
							<div className="modal-card">
								<h3>Add New User</h3>

								{addError && <div className="error-general">{addError}</div>}

								<form className="edit-modal-form" onSubmit={handleAddUser}>
									<div className="form-group">
										<label htmlFor="username">Username</label>
										<input
											id="username"
											type="text"
											value={addForm.username}
											onChange={handleAddChange}
											required
										/>
										{addFieldErrors.username && <span className="error-field">{addFieldErrors.username[0]}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="email">Email</label>
										<input
											id="email"
											type="email"
											value={addForm.email}
											onChange={handleAddChange}
											required
										/>
										{addFieldErrors.email && <span className="error-field">{addFieldErrors.email[0]}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="password">Password</label>
										<input
											id="password"
											type="password"
											value={addForm.password}
											onChange={handleAddChange}
											placeholder="••••••••"
											required
										/>
										{addFieldErrors.password && <span className="error-field">{addFieldErrors.password[0]}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="role">Role</label>
										<select
											id="role"
											value={addForm.role}
											onChange={handleAddChange}
										>
											<option value="student">Student</option>
											<option value="teacher">Teacher</option>
											<option value="admin">Admin</option>
										</select>
										{addFieldErrors.role && <span className="error-field">{addFieldErrors.role[0]}</span>}
									</div>

									<div className="modal-actions">
										<button
											type="button"
											className="btn-modal-cancel"
											onClick={() => setIsAddModalOpen(false)}
										>
											Cancel
										</button>
										<button type="submit" className="btn-modal-save">
											Create User
										</button>
									</div>
								</form>
							</div>
						</div>
					)}

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
										{editFieldErrors.username && <span className="error-field">{editFieldErrors.username[0]}</span>}
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
										{editFieldErrors.email && <span className="error-field">{editFieldErrors.email[0]}</span>}
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
										{editFieldErrors.role && <span className="error-field">{editFieldErrors.role[0]}</span>}
									</div>

									<hr className="divider" />

									<h3>Change User Password</h3>

									<div className="form-group">
										<label htmlFor="new_password">New Password</label>
										<input
											id="new_password"
											type="password"
											value={editForm.new_password}
											onChange={handleEditChange}
											placeholder="••••••••"
										/>
										{editFieldErrors.new_password && <span className="error-field">{editFieldErrors.new_password[0]}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="new_password_confirmation">Re-type New Password</label>
										<input
											id="new_password_confirmation"
											type="password"
											value={editForm.new_password_confirmation}
											onChange={handleEditChange}
											placeholder="••••••••"
										/>
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

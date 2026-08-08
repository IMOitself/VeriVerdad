import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../api.js'
import { Eye } from '../components/shared/icons'
import '../styles/PasswordField.css'
import './Account.css'
import Sidebar from '../components/dashboard/Sidebar'

export default function Account() {
	const [showNewPass, setShowNewPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);

	const [form, setForm] = useState({
		username: '',
		email: '',
		new_password: '',
		new_password_confirmation: ''
	});

	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [fieldErrors, setFieldErrors] = useState({});

	useEffect(function () {
		async function fetchProfileData() {
			const result = await getProfile();
			if (result.success && result.data) {
				setForm(function (prevForm) {
					return {
						...prevForm,
						username: result.data.username || '',
						email: result.data.email || ''
					};
				});
			} else if (result.error) {
				setError(result.error);
			}
		}
		fetchProfileData();
	}, []);

	function handleChange(e) {
		const id = e.target.id;
		const value = e.target.value;
		setForm(function (prevForm) {
			return {
				...prevForm,
				[id]: value
			};
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setSuccessMessage('');
		setFieldErrors({});

		const payload = {};

		if (form.username) payload.username = form.username;
		if (form.email) payload.email = form.email;
		if (form.new_password) {
			payload.new_password = form.new_password;
			payload.new_password_confirmation = form.new_password_confirmation;
		}

		const result = await updateProfile(payload);

		if (result.success) {
			setSuccessMessage('Profile updated successfully!');
			if (result.data) {
				localStorage.setItem('user', JSON.stringify(result.data));
				window.dispatchEvent(new Event('storage'));
			}
			setForm(function (prevForm) {
				return {
					...prevForm,
					new_password: '',
					new_password_confirmation: ''
				};
			});
		} else {
			if (result.errors) {
				setFieldErrors(result.errors);
			} else if (result.message) {
				setError(result.message);
			} else if (result.error) {
				setError(result.error);
			} else {
				setError('Something went wrong');
			}
		}
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="account-card">
					<h2>Account Management</h2>
					<p className="account-subtitle">Manage your profile information, password, and preferences.</p>

					<form className="account-form" onSubmit={handleSubmit}>
						{error && <div className="error-general">{error}</div>}
						{successMessage && <div className="success-general">{successMessage}</div>}

						<div className="form-group">
							<label htmlFor="username">Username</label>
							<input
								id="username"
								type="text"
								value={form.username}
								onChange={handleChange}
							/>
							{fieldErrors.username && <span className="error-field">{fieldErrors.username[0]}</span>}
						</div>

						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input
								id="email"
								type="email"
								value={form.email}
								onChange={handleChange}
							/>
							{fieldErrors.email && <span className="error-field">{fieldErrors.email[0]}</span>}
						</div>

						<hr className="divider" />

						<h3>Change Password</h3>

						<div className="form-group">
							<label htmlFor="new_password">New Password</label>
							<div className="password-wrapper">
								<input
									id="new_password"
									type={showNewPass ? "text" : "password"}
									placeholder="••••••••"
									value={form.new_password}
									onChange={handleChange}
								/>
								<button
									type="button"
									className="toggle-password"
									onClick={() => setShowNewPass(!showNewPass)}
								>
									<Eye visible={showNewPass} />
								</button>
							</div>
							{fieldErrors.new_password && <span className="error-field">{fieldErrors.new_password[0]}</span>}
						</div>

						<div className="form-group">
							<label htmlFor="new_password_confirmation">Re-type New Password</label>
							<div className="password-wrapper">
								<input
									id="new_password_confirmation"
									type={showConfirmPass ? "text" : "password"}
									placeholder="••••••••"
									value={form.new_password_confirmation}
									onChange={handleChange}
								/>
								<button
									type="button"
									className="toggle-password"
									onClick={() => setShowConfirmPass(!showConfirmPass)}
								>
									<Eye visible={showConfirmPass} />
								</button>
							</div>
						</div>

						<button type="submit" className="btn-save">Save Changes</button>
					</form>
				</div>
			</div>
		</div>
	);
}
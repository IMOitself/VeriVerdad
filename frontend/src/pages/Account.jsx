import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api.js';
import './Account.css';
import Sidebar from '../components/dashboard/Sidebar';

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
									{showNewPass ? (
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
											<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
											<path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" />
										</svg>
									)}
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
									{showConfirmPass ? (
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
											<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
											<path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" />
										</svg>
									)}
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

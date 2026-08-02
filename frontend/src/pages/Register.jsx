import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import './Login.css';

export default function Register() {
	const { register } = useAuth();
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		section_id: '',
	});
	const [sections, setSections] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		api.get('/sections')
			.then(data => setSections(data || []))
			.catch(() => setSections([]));
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await register(formData);
		} catch (err) {
			setError(err.message || 'Registration failed. Please check your inputs.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-card">
			<h2 className="auth-title">Student Registration</h2>

			{error && <div className="auth-error">{error}</div>}

			<form onSubmit={handleSubmit} className="auth-form">
				<div className="form-row">
					<div className="form-group">
						<label>First Name</label>
						<input
							type="text"
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>
					<div className="form-group">
						<label>Last Name</label>
						<input
							type="text"
							name="last_name"
							value={formData.last_name}
							onChange={handleChange}
							className="form-input"
							required
						/>
					</div>
				</div>

				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="form-input"
						required
					/>
				</div>

				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="form-input"
						required
						minLength={8}
					/>
				</div>

				<div className="form-group">
					<label>Class Section</label>
					<select
						name="section_id"
						value={formData.section_id}
						onChange={handleChange}
						className="form-select"
					>
						<option value="">Select Section (Optional)</option>
						{sections.map(sec => (
							<option key={sec.id} value={sec.id}>
								{sec.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit" disabled={loading} className="btn-primary">
					{loading ? 'Registering...' : 'Register Account'}
				</button>
			</form>

			<p className="auth-footer">
				Already have an account?{' '}
				<Link to="/login" className="auth-link">
					Login here
				</Link>
			</p>
		</div>
	);
}

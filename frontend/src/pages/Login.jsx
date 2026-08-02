import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
	const { login } = useAuth();
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setCredentials({
			...credentials,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(credentials);
		} catch (err) {
			setError(err.message || 'Login failed. Please check your credentials.');
		} finally {
			setLoading(false);
		}
	};

	const handleDemoLogin = async (role) => {
		setError('');
		setLoading(true);

		const demoEmail = role === 'student' ? 'student@veriverdad.ph' : 'teacher@veriverdad.ph';
		const demoPassword = 'password123';

		try {
			await login({ email: demoEmail, password: demoPassword });
		} catch (err) {
			setError(err.message || `Demo ${role} login failed.`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-card">
			<h2 className="auth-title">Login</h2>

			{error && <div className="auth-error">{error}</div>}

			<form onSubmit={handleSubmit} className="auth-form">
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						name="email"
						value={credentials.email}
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
						value={credentials.password}
						onChange={handleChange}
						className="form-input"
						required
					/>
				</div>

				<button type="submit" disabled={loading} className="btn-primary">
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<div className="divider-container">
				<div className="divider-line"></div>
				<span className="divider-text">or</span>
				<div className="divider-line"></div>
			</div>

			<div className="demo-buttons-stack">
				<button
					type="button"
					onClick={() => handleDemoLogin('student')}
					disabled={loading}
					className="btn-secondary"
				>
					Login as Demo Student
				</button>
				<button
					type="button"
					onClick={() => handleDemoLogin('teacher')}
					disabled={loading}
					className="btn-secondary"
				>
					Login as Demo Teacher
				</button>
			</div>

			<p className="auth-footer">
				Don't have an account?{' '}
				<Link to="/register" className="auth-link">
					Register here
				</Link>
			</p>
		</div>
	);
}

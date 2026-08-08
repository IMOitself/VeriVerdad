import { Link } from 'react-router'
import { useState } from 'react'
import { register } from '../api.js'
import { Eye } from '../components/shared/icons'
import '../styles/PasswordField.css'
import './Register.css'

export default function Register() {
	const [showPassword, setShowPassword] = useState(false)
	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [fieldErrors, setFieldErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		setFieldErrors({})
		setIsLoading(true)

		const payload = {
			username: form.username.trim(),
			email: form.email.trim(),
			password: form.password,
			role: 'student',
		}

		const result = await register(payload)
		setIsLoading(false)

		if (result.success) {
			localStorage.setItem('token', result.token)
			localStorage.setItem('user', JSON.stringify(result.user))
			window.dispatchEvent(new Event('storage'))
			window.location.href = '/dashboard'
		} else {
			if (result.errors) {
				setFieldErrors(result.errors)
			} else {
				setError(result.message || result.error || 'Something went wrong')
			}
		}
	}

	function handleChange(e) {
		setForm({
			...form,
			[e.target.id]: e.target.value,
		})
	}

	return (
		<div className="register-page">
			<div className="register-container">
				<div className="register-header">
					<h1>Create Account</h1>
					<p>Join the truth-seekers</p>
				</div>

				<form className="register-form" onSubmit={handleSubmit}>
					{error && <div className="error-general">{error}</div>}

					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							id="username"
							type="text"
							placeholder="username"
							value={form.username}
							onChange={handleChange}
							required
							autoComplete="username"
						/>
						{fieldErrors.username && (
							<span className="error-field">{fieldErrors.username[0]}</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							placeholder="email@example.com"
							value={form.email}
							onChange={handleChange}
							required
							autoComplete="email"
						/>
						{fieldErrors.email && (
							<span className="error-field">{fieldErrors.email[0]}</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<div className="password-wrapper">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="••••••••"
								value={form.password}
								onChange={handleChange}
								required
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="toggle-password"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								<Eye visible={showPassword} />
							</button>
						</div>
						{fieldErrors.password && (
							<span className="error-field">{fieldErrors.password[0]}</span>
						)}
					</div>

					<button
						type="submit"
						className="btn-register-submit"
						disabled={isLoading}
					>
						{isLoading ? 'Creating Account...' : 'Create Account'}
					</button>
				</form>

				<p className="register-footer">
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	)
}
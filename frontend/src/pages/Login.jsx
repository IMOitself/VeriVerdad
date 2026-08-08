import { Link } from 'react-router'
import { useState } from 'react'
import { login } from '../api.js'
import { Eye } from '../components/shared/icons'
import '../styles/PasswordField.css'
import './Login.css'

export default function Login() {
	const [showPassword, setShowPassword] = useState(false)
	const [form, setForm] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [fieldErrors, setFieldErrors] = useState({})

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		setFieldErrors({})

		const result = await login(form)

		if (result.success) {
			localStorage.setItem('token', result.token)
			window.location.href = '/dashboard'
		} else {
			if (result.errors) {
				setFieldErrors(result.errors)
			} else if (result.message) {
				setFieldErrors({
					email: [result.message],
					password: [result.message],
				})
			} else if (result.error) {
				setError(result.error)
			} else {
				setError('Something went wrong')
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
		<div className="login-page">
			<div className="login-container">
				<div className="login-header">
					<h1>Welcome Back</h1>
					<p>We're so excited to see you again</p>
				</div>

				<form className="login-form" onSubmit={handleSubmit}>
					{error && <div className="error-general">{error}</div>}

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							placeholder="email@example.com"
							value={form.email}
							onChange={handleChange}
							required
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
							/>
							<button
								type="button"
								className="toggle-password"
								onClick={() => setShowPassword(!showPassword)}
							>
								<Eye visible={showPassword} />
							</button>
						</div>
						{fieldErrors.password && (
							<span className="error-field">{fieldErrors.password[0]}</span>
						)}
					</div>

					<button type="submit" className="btn-login-submit">
						Sign In
					</button>
				</form>

				<p className="login-footer">
					Don't have an account? <Link to="/register">Register</Link>
				</p>
			</div>
		</div>
	)
}
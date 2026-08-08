import { Link } from 'react-router'
import { useState } from 'react'
import { login } from '../api.js'
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
								{showPassword ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 -960 960 960"
										width="24px"
										fill="#1f1f1f"
									>
										<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 -960 960 960"
										width="24px"
										fill="#1f1f1f"
									>
										<path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" />
									</svg>
								)}
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
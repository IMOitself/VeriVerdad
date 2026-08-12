import { useState } from 'react'
import { useLocation, Link } from 'react-router'
import { Eye } from '../components/Icons'

export const PasswordField = ({ id, autoComplete, py, errorText }) => {
	const [show, setShow] = useState(false)
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Password</label>
			<div className="relative flex items-center">
				<input
					id={id}
					type={show ? 'text' : 'password'}
					required
					autoComplete={autoComplete}
					className={`w-full px-4 ${py} border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)] pr-11`}
				/>
				<button
					type="button"
					tabIndex={-1}
					onClick={() => setShow(!show)}
					className={`absolute right-2 p-1.5 rounded-md flex items-center justify-center opacity-60 hover:opacity-80 ${show ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-faint)]'}`}
				>
					<Eye visible={show} />
				</button>
			</div>
			{errorText && <span className="text-xs text-[var(--color-error)] font-medium min-h-[16px]">{errorText}</span>}
		</div>
	)
}

export const Component = () => {
	const location = useLocation()
	const isRegister = location.pathname === '/register'

	return (
		<div className="min-h-screen flex justify-center items-center bg-[var(--color-bg)] p-4 sm:p-6 lg:p-8 box-border">
			<div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-[440px] lg:max-w-[960px] w-full lg:min-h-[600px] shadow-sm relative overflow-hidden flex flex-col lg:flex-row">
				<div className={`w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center ${isRegister ? 'max-lg:hidden' : 'block'}`}>
					<div className="flex items-center gap-2 mb-6">
						<img src="/logo.png" alt="" className="h-6 w-auto object-contain" />
						<span className="text-xs font-bold tracking-widest text-[var(--color-primary)] uppercase">VeriVerdad</span>
					</div>
					<div className="flex flex-col gap-1 mb-6">
						<h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">Welcome Back</h1>
						<p className="text-sm text-[var(--color-text-muted)]">Sign in to continue verifying feeds</p>
					</div>
					<form key={location.pathname} className="flex flex-col gap-4 w-full">
						<div className="min-h-[42px] flex items-center justify-center bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20 px-3 py-2 rounded-lg text-xs font-medium text-center">
							Something went wrong
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Email Address</label>
							<input id="login-email" type="email" required autoComplete="email" className="px-4 py-3 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)]" />
							<span className="text-xs text-[var(--color-error)] font-medium min-h-[16px]">Email or password is incorrect</span>
						</div>
						<PasswordField id="login-password" autoComplete="current-password" py="py-3" errorText="Email or password is incorrect" />
						<button type="submit" className="mt-2 py-3.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-bold cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
							Sign In
						</button>
						<p className="text-center text-xs text-[var(--color-text-muted)] mt-2 lg:hidden">
							Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-bold hover:opacity-80">Register</Link>
						</p>
					</form>
				</div>

				<div className={`w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center ${isRegister ? 'block' : 'max-lg:hidden'}`}>
					<div className="flex items-center gap-2 mb-6">
						<img src="/logo.png" alt="" className="h-6 w-auto object-contain" />
						<span className="text-xs font-bold tracking-widest text-[var(--color-primary)] uppercase">VeriVerdad</span>
					</div>
					<div className="flex flex-col gap-1 mb-6">
						<h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">Create Account</h1>
						<p className="text-sm text-[var(--color-text-muted)]">Join the network of truth-seekers</p>
					</div>
					<form key={location.pathname} className="flex flex-col gap-3.5 w-full">
						<div className="min-h-[42px] flex items-center justify-center bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20 px-3 py-2 rounded-lg text-xs font-medium text-center">
							Something went wrong
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="reg-username" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Username</label>
							<input id="reg-username" type="text" required autoComplete="username" className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)]" />
							<span className="text-xs text-[var(--color-error)] font-medium min-h-[16px]">Choose a username to claim your seat</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Email Address</label>
							<input id="reg-email" type="email" required autoComplete="email" className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)]" />
							<span className="text-xs text-[var(--color-error)] font-medium min-h-[16px]">Enter a valid email address</span>
						</div>
						<PasswordField id="reg-password" autoComplete="new-password" py="py-2.5" errorText="Password must be at least 8 characters" />
						<button type="submit" className="mt-2 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-bold cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
							Create Account
						</button>
						<p className="text-center text-xs text-[var(--color-text-muted)] mt-2 lg:hidden">
							Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-bold hover:opacity-80">Login</Link>
						</p>
					</form>
				</div>

				<div className={`hidden lg:flex absolute top-0 bottom-0 left-0 w-1/2 bg-[var(--color-primary)] text-white p-12 flex-col items-center justify-center text-center z-10 ${isRegister ? 'translate-x-0' : 'translate-x-full'}`}>
					<div className="flex flex-col items-center gap-3">
						<h2 className="text-3xl font-extrabold tracking-tight text-white">
							{isRegister ? 'Welcome Back!' : 'Spot the Truth'}
						</h2>
						<p className="text-sm opacity-80 max-w-xs leading-relaxed text-[var(--color-surface)]">
							{isRegister ? 'Sign in to trace primary sources, unmask clout bias, and check the receipts.' : 'Join VeriVerdad & Veribot to master source verification before hitting share.'}
						</p>
						<Link to={isRegister ? '/login' : '/register'} className="mt-4 px-8 py-3 border border-white/40 bg-white/10 rounded-lg text-sm font-bold text-white hover:opacity-80">
							{isRegister ? 'Sign In' : 'Create Account'}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
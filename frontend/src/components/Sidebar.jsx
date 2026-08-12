import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { RobotIcon, LogoutIcon, HomeIcon } from '../components/Icons'
import { ConfirmationModal } from './ConfirmationModal'
import { clearAuth } from '../api'

const navItems = [
	{ path: '/home', label: 'Home', Icon: props => <HomeIcon className="w-5 h-5 shrink-0" {...props} /> },
	{ path: '/veribot', label: 'Veribot', Icon: props => <RobotIcon className="w-5 h-5 shrink-0" {...props} /> }
]

export const Sidebar = () => {
	const [open, setOpen] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	const handleLogout = () => {
		clearAuth()
		navigate('/login', { replace: true })
	}

	return (
		<>
			{open && <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 z-30 bg-[var(--color-primary)] opacity-50" />}

			<header className="lg:hidden flex items-center justify-between p-4 bg-[var(--color-primary)] text-white border-b border-[var(--color-border)]">
				<div className="flex items-center gap-3">
					<img src="/logo.png" alt="" className="h-7 w-auto object-contain" />
					<span className="text-sm font-bold tracking-wider">VERIVERDAD</span>
				</div>
				<button type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-1 text-white hover:opacity-80">
					<svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24">
						{open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
					</svg>
				</button>
			</header>

			<aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col justify-between ${open ? 'flex' : 'hidden lg:flex'}`}>
				<div className="flex flex-col gap-6 p-6">
					<div className="hidden lg:flex items-center gap-3">
						<img src="/logo.png" alt="" className="h-8 w-auto object-contain" />
						<span className="text-sm font-bold tracking-wider text-[var(--color-primary)]">VERIVERDAD</span>
					</div>

					<nav className="flex flex-col gap-1">
						{navItems.map(item => (
							<Link key={item.path} to={item.path} onClick={() => setOpen(false)} aria-current={location.pathname === item.path ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold no-underline hover:opacity-80 ${location.pathname === item.path ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] bg-transparent'}`}>
								<item.Icon />
								<span>{item.label}</span>
							</Link>
						))}
					</nav>
				</div>

				<div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
					<button type="button" onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-border)] bg-[var(--color-surface)] rounded-lg hover:opacity-80 cursor-pointer">
						<LogoutIcon className="w-4 h-4 shrink-0" />
						<span>Sign Out</span>
					</button>
				</div>
			</aside>

			<ConfirmationModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={handleLogout}
				title="Sign Out"
				message="Are you sure you want to log out of your account?"
				confirmText="Sign Out"
				cancelText="Cancel"
			/>
		</>
	)
}
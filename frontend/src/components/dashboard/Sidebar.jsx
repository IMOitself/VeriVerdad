import { useState, useEffect } from 'react'
import { NavLink } from 'react-router'
import LogoutButton from '../shared/LogoutButton'
import { getProfile } from '../../api.js'
import './Sidebar.css'

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(function () {
		return localStorage.getItem('sidebar_collapsed') === 'true'
	})

	const [userData, setUserData] = useState(function () {
		const cachedUser = localStorage.getItem('user')
		if (cachedUser) {
			try {
				const parsed = JSON.parse(cachedUser)
				return {
					username: parsed.username || 'User',
					role: parsed.role || 'student'
				}
			} catch (e) {
				return { username: 'User', role: 'student' }
			}
		}
		return { username: 'User', role: 'student' }
	})

	useEffect(function () {
		async function loadUser() {
			const result = await getProfile()
			if (result.success && result.data) {
				setUserData({
					username: result.data.username || 'User',
					role: result.data.role || 'student'
				})
				localStorage.setItem('user', JSON.stringify(result.data))
			}
		}

		function handleStorageChange() {
			const cachedUser = localStorage.getItem('user')
			if (cachedUser) {
				try {
					const parsed = JSON.parse(cachedUser)
					setUserData({
						username: parsed.username || 'User',
						role: parsed.role || 'student'
					})
				} catch (e) { }
			}
		}

		window.addEventListener('storage', handleStorageChange)
		loadUser()

		return function () {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	function toggleSidebar() {
		const nextState = !isCollapsed
		setIsCollapsed(nextState)
		localStorage.setItem('sidebar_collapsed', String(nextState))
	}

	return (
		<aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
			<div className="sidebar-header">
				<button
					className="sidebar-toggle-btn"
					onClick={toggleSidebar}
					title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h320v-560H200v560Zm560 0v-560H600v560h160Z" />
					</svg>
				</button>

				<div className="sidebar-brand">
					<img
						src="/logo.png"
						alt="VeriVerdad Logo"
						className="sidebar-logo-img"
					/>
					{!isCollapsed && (
						<span className="sidebar-brand-title">VERIVERDAD</span>
					)}
				</div>
			</div>

			<nav className="sidebar-nav">
				<NavLink
					to="/dashboard"
					className={({ isActive }) =>
						isActive ? 'nav-item active' : 'nav-item'
					}
					title={isCollapsed ? 'Dashboard' : ''}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
					</svg>
					{!isCollapsed && <span>Dashboard</span>}
				</NavLink>

				<NavLink
					to="/veribot"
					className={({ isActive }) =>
						isActive ? 'nav-item active' : 'nav-item'
					}
					title={isCollapsed ? 'VeriBot AI' : ''}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M160-120v-200q0-33 23.5-56.5T240-400h480q33 0 56.5 23.5T800-320v200H160Zm200-320q-83 0-141.5-58.5T160-640q0-83 58.5-141.5T360-840h240q83 0 141.5 58.5T800-640q0 83-58.5 141.5T600-440H360ZM240-200h480v-120H240v120Zm120-320h240q50 0 85-35t35-85q0-50-35-85t-85-35H360q-50 0-85 35t-35 85q0 50 35 85t85 35Zm28.5-91.5Q400-623 400-640t-11.5-28.5Q377-680 360-680t-28.5 11.5Q320-657 320-640t11.5 28.5Q343-600 360-600t28.5-11.5Zm240 0Q640-623 640-640t-11.5-28.5Q617-680 600-680t-28.5 11.5Q560-657 560-640t11.5 28.5Q583-600 600-600t28.5-11.5ZM480-200Zm0-440Z" />
					</svg>
					{!isCollapsed && <span>VeriBot AI</span>}
				</NavLink>

				<NavLink
					to="/sources"
					className={({ isActive }) =>
						isActive ? 'nav-item active' : 'nav-item'
					}
					title={isCollapsed ? 'Sources' : ''}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M838-65 720-183v89h-80v-226h226v80h-90l118 118-56 57ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 20-2 40t-6 40h-82q5-20 7.5-40t2.5-40q0-20-2.5-40t-7.5-40H654q3 20 4.5 40t1.5 40q0 20-1.5 40t-4.5 40h-80q3-20 4.5-40t1.5-40q0-20-1.5-40t-4.5-40H386q-3 20-4.5 40t-1.5 40q0 20 1.5 40t4.5 40h134v80H404q12 43 31 82.5t45 75.5q20 0 40-2.5t40-4.5v82q-20 2-40 4.5T480-80ZM170-400h136q-3-20-4.5-40t-1.5-40q0-20 1.5-40t4.5-40H170q-5 20-7.5 40t-2.5 40q0 20 2.5 40t7.5 40Zm34-240h118q9-37 22.5-72.5T376-782q-55 18-99 54.5T204-640Zm172 462q-18-34-31.5-69.5T322-320H204q29 51 73 87.5t99 54.5Zm28-462h152q-12-43-31-82.5T480-798q-26 36-45 75.5T404-640Zm234 0h118q-29-51-73-87.5T584-782q18 34 31.5 69.5T638-640Z" />
					</svg>
					{!isCollapsed && <span>Sources</span>}
				</NavLink>

				<NavLink
					to="/history"
					className={({ isActive }) =>
						isActive ? 'nav-item active' : 'nav-item'
					}
					title={isCollapsed ? 'History' : ''}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
					</svg>
					{!isCollapsed && <span>History</span>}
				</NavLink>

				{(userData.role === 'teacher' || userData.role === 'admin') && (
					<NavLink
						to="/classrooms"
						className={({ isActive }) =>
							isActive ? 'nav-item active' : 'nav-item'
						}
						title={isCollapsed ? 'Classrooms' : ''}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
							<path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-109v-151l-200 109-200-109v151l200 109Zm0-241Zm0 90Zm0 0Z" />
						</svg>
						{!isCollapsed && <span>Classrooms</span>}
					</NavLink>
				)}

				{(userData.role === 'teacher' || userData.role === 'admin') && (
					<NavLink
						to="/statistics"
						className={({ isActive }) =>
							isActive ? 'nav-item active' : 'nav-item'
						}
						title={isCollapsed ? 'Statistics' : ''}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
							<path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
						</svg>
						{!isCollapsed && <span>Statistics</span>}
					</NavLink>
				)}

				{userData.role === 'admin' && (
					<NavLink
						to="/admin"
						className={({ isActive }) =>
							isActive ? 'nav-item active' : 'nav-item'
						}
						title={isCollapsed ? 'Admin' : ''}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
							<path d="M722.5-297.5Q740-315 740-340t-17.5-42.5Q705-400 680-400t-42.5 17.5Q620-365 620-340t17.5 42.5Q655-280 680-280t42.5-17.5ZM680-160q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" />
						</svg>
						{!isCollapsed && <span>Admin</span>}
					</NavLink>
				)}
			</nav>

			<div className="sidebar-footer">
				<NavLink
					to="/account"
					className="btn-account"
					title={isCollapsed ? userData.username : ''}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z" />
					</svg>
					{!isCollapsed && <span>{userData.username}</span>}
				</NavLink>
				<LogoutButton isCollapsed={isCollapsed} />
			</div>
		</aside>
	)
}
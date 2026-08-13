import { createContext, useContext, useState, useEffect } from 'react'
import { getAuthToken, getAuthUser, clearAuth } from './api'

const AuthContext = createContext({ user: null, token: null, logout: clearAuth })

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(getAuthToken())
	const [user, setUser] = useState(getAuthUser())

	useEffect(() => {
		const handleStorage = e => {
			if (e.key === 'auth_token' || e.key === 'auth_user') {
				setToken(getAuthToken())
				setUser(getAuthUser())
			}
		}
		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [])

	const logout = () => (clearAuth(), setToken(null), setUser(null))

	return (
		<AuthContext.Provider value={{ user, token, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)

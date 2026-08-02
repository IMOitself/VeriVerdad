import { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../api/auth';

export const AuthContext = createContext(null);

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!token) {
			setLoading(false);
			return;
		}

		auth.getUser(token)
			.then(user => {
				setUser(user);
			})
			.catch(() => {
				localStorage.removeItem('token');
				setToken(null);
				setUser(null);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [token]);

	async function login(credentials) {
		const data = await auth.login(credentials);

		localStorage.setItem('token', data.token);

		setToken(data.token);
		setUser(data.user);
	}

	async function register(credentials) {
		const data = await auth.register(credentials);

		localStorage.setItem('token', data.token);

		setToken(data.token);
		setUser(data.user);
	}

	async function logout() {
		await auth.logout(token);

		localStorage.removeItem('token');

		setToken(null);
		setUser(null);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				login,
				register,
				logout,
				authenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
import axios from "axios"

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"

const getStoredToken = () => localStorage.getItem(TOKEN_KEY)
const getStoredUser = () => {
	const raw = localStorage.getItem(USER_KEY)
	return raw ? JSON.parse(raw) : null
}

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
		"X-Secret-Token": import.meta.env.VITE_SECRET_TOKEN,
	},
})

api.interceptors.request.use((config) => {
	const token = getStoredToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
)

export function setAuth(token, user) {
	localStorage.setItem(TOKEN_KEY, token)
	localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
}

export function getAuthToken() {
	return getStoredToken()
}

export function getAuthUser() {
	return getStoredUser()
}

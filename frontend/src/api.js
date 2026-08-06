const API_URL = import.meta.env.VITE_API_URL
const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN

const headers = {
	'Content-Type': 'application/json',
	'X-Secret-Token': SECRET_TOKEN
}

export async function register(data) {
	try {
		const response = await fetch(`${API_URL}/api/register`, {
			method: 'POST',
			headers,
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Something went wrong',
				errors: result.errors || null
			}
		}

		return { success: true, ...result }

	} catch (err) {
		return {
			success: false,
			error: 'Check your internet connection'
		}
	}
}

export async function login(data) {
	try {
		const response = await fetch(`${API_URL}/api/login`, {
			method: 'POST',
			headers,
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Something went wrong'
			}
		}

		return { success: true, ...result }

	} catch (err) {
		return {
			success: false,
			error: 'Check your internet connection'
		}
	}
}

export async function logout() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/logout`, {
			method: 'POST',
			headers: {
				...headers,
				'Authorization': `Bearer ${token}`
			}
		})

		if (!response.ok) {
			return {
				success: false,
				message: 'Logout failed'
			}
		}

		return { success: true }

	} catch (err) {
		return {
			success: false,
			error: 'Check your internet connection'
		}
	}
}
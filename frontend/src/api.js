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

export async function logout() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/logout`, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
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

export async function getProfile() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/profile`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch profile',
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

export async function updateProfile(data) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/profile`, {
			method: 'PATCH',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to update profile',
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

export async function getUsers() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/users`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch users',
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

export async function updateUser(id, data) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/users/${id}`, {
			method: 'PATCH',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to update user',
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

export async function deleteUser(id) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/users/${id}`, {
			method: 'DELETE',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to delete user',
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

export async function getTasks() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/tasks`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch tasks',
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

export async function createTask(data) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/tasks`, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to create task',
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

export async function getBadges() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/badges`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch badges',
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

export async function getHistory() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/veribot/history`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch history',
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

export async function getStats(sectionId = null) {
	try {
		const token = localStorage.getItem('token')
		const url = sectionId
			? `${API_URL}/api/veribot/stats?section_id=${sectionId}`
			: `${API_URL}/api/veribot/stats`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch statistics',
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

export async function analyzeVeribot(
	inputQuery,
	history = [],
	veribotId = null
) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/veribot`, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				input_query: inputQuery,
				history: history,
				veribot_id: veribotId || undefined
			})
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Verification request failed.',
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

export async function submitVeribotQuiz(veribotId, answers) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/veribot/submit`, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				veribot_id: veribotId,
				answers: answers
			})
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Quiz submission failed.'
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

export async function deleteVeribotSession(id) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/veribot/${id}`, {
			method: 'DELETE',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to delete chat session'
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

export async function getPublicSections() {
	try {
		const response = await fetch(`${API_URL}/api/sections-list`, {
			method: 'GET',
			headers
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch sections'
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

export async function getSections() {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/sections`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch sections'
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

export async function createSection(data) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/sections`, {
			method: 'POST',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to create section',
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

export async function updateSection(id, data) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/sections/${id}`, {
			method: 'PATCH',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to update section',
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

export async function deleteSection(id) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/sections/${id}`, {
			method: 'DELETE',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to delete section'
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

export async function getSectionStats(id) {
	try {
		const token = localStorage.getItem('token')

		const response = await fetch(`${API_URL}/api/sections/${id}/stats`, {
			method: 'GET',
			headers: {
				...headers,
				Authorization: `Bearer ${token}`
			}
		})

		const result = await response.json()

		if (!response.ok) {
			return {
				success: false,
				message: result.message || 'Failed to fetch section statistics'
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
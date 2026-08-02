const API_URL = import.meta.env.VITE_API_URL;
const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

async function handleResponse(response) {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();
	let data;
	try {
		data = text ? JSON.parse(text) : {};
	} catch {
		data = { message: text || `HTTP Error ${response.status}` };
	}

	if (!response.ok) {
		throw data;
	}

	return data;
}

export const api = {
	get: (url, token) =>
		fetch(`${API_URL}${url}`, {
			headers: {
				'X-Secret-Token': SECRET_TOKEN,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		}).then(handleResponse),

	post: (url, body, token) =>
		fetch(`${API_URL}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Secret-Token': SECRET_TOKEN,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify(body),
		}).then(handleResponse),
};
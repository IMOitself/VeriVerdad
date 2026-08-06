import { logout } from '../api.js';

export default function LogoutButton() {
	async function handleLogout() {
		await logout();
		localStorage.removeItem('token');
		window.location.href = '/login';
	}

	return (
		<button onClick={handleLogout}>Logout</button>
	);
}

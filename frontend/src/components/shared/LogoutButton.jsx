import { logout } from '../../api.js';

export default function LogoutButton() {
	async function handleLogout() {
		await logout();
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		window.location.href = '/login';
	}

	return (
		<button className="btn-logout" onClick={handleLogout}>Logout</button>
	);
}

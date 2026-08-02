import { api } from './client';

export function login(data) {
	return api.post('/login', data);
}

export function register(data) {
	return api.post('/register', data);
}

export function logout(token) {
	return api.post('/logout', {}, token);
}

export function getUser(token) {
	return api.get('/user', token);
}
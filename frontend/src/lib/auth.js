import { getAuthToken, getAuthUser } from "@/services/api"

export function isAuthenticated() {
	return !!getAuthToken()
}

export function getUser() {
	return getAuthUser()
}

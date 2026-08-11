import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, setAuth, clearAuth } from "../services/api"
import { useNavigate } from "react-router"

const authEndpoint = (endpoint, data) =>
	api.post(endpoint, data).then((res) => {
		const { user, token } = res.data.data
		setAuth(token, user)
		return res.data
	})

const login = (data) => authEndpoint("/api/login", data)
const register = (data) => authEndpoint("/api/register", data)
const logout = () => api.post("/api/logout").then((res) => res.data)

const createAuthMutation = (mutationFn, navigate) => ({
	mutationFn,
	onSuccess: () => navigate("/dashboard", { replace: true }),
})

export function useLogin() {
	const navigate = useNavigate()
	return useMutation(createAuthMutation(login, navigate))
}

export function useRegister() {
	const navigate = useNavigate()
	return useMutation(createAuthMutation(register, navigate))
}

export function useLogout() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			clearAuth()
			queryClient.invalidateQueries()
			navigate("/login", { replace: true })
		},
	})
}

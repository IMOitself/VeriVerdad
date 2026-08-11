import { getAuthToken, getAuthUser } from "@/services/api"

export const isAuthenticated = () => !!getAuthToken()
export const getUser = () => getAuthUser()

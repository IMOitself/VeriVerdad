import { createBrowserRouter, redirect } from "react-router"
import { isAuthenticated } from "@/lib/auth"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"

export const router = createBrowserRouter([
	{
		path: "/",
		loader: () => redirect(isAuthenticated() ? "/dashboard" : "/login"),
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "*",
		element: <Login />,
	},
])

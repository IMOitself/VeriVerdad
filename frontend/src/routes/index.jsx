import { createBrowserRouter, redirect } from "react-router"
import { isAuthenticated } from "@/lib/auth"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Veribot from "../pages/Veribot"

export const router = createBrowserRouter([
	{
		path: "/",
		loader: () => redirect(isAuthenticated() ? "/dashboard" : "/login"),
	},
		{
			path: "/veribot/:conversationId?",
			element: <Veribot />,
		},
	{
		path: "/login",
		element: <Login />,
	},
	{
		element: <ProtectedRoute />,
		children: [
			{ path: "/dashboard", element: <Dashboard /> },
			{ path: "/veribot", element: <Veribot /> },
		],
	},
	{
		path: "*",
		element: <Login />,
	},
])

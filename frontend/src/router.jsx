import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { PageLoader } from './components/PageLoader'
import { getAuthToken } from './api'

export const ProtectedRoute = () => getAuthToken() ? <Outlet /> : <Navigate to="/login" replace />

export const GuestRoute = () => getAuthToken() ? <Navigate to="/sample" replace /> : <Outlet />

export const router = createBrowserRouter([
	{
		HydrateFallback: PageLoader,
		children: [
			{
				path: '/',
				lazy: () => import('./pages/Landing')
			},
			{
				element: <GuestRoute />,
				children: [
					{
						path: '/login',
						lazy: () => import('./pages/Auth')
					},
					{
						path: '/register',
						lazy: () => import('./pages/Auth')
					}
				]
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: '/sample',
						lazy: () => import('./pages/Sample')
					},
					{
						path: '/Veribot',
						lazy: () => import('./pages/Veribot')
					}
				]
			},
			{
				path: '*',
				element: <Navigate to="/" replace />
			}
		]
	}
])
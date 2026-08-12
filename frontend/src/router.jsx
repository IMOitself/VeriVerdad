import { createBrowserRouter, Navigate } from 'react-router'
import { PageLoader } from './components/PageLoader'

export const router = createBrowserRouter([
	{
		HydrateFallback: PageLoader,
		children: [
			{
				path: '/',
				lazy: () => import('./pages/Landing')
			},
			{
				path: '/login',
				lazy: () => import('./pages/Auth')
			},
			{
				path: '/register',
				lazy: () => import('./pages/Auth')
			},
			{
				path: '*',
				element: <Navigate to="/" replace />
			}
		]
	}
])
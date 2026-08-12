import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { getAuthToken } from './api'
import { PageLoader } from './components/PageLoader'

const lazyPage = importFn => async () => {
	try {
		const mod = await importFn()
		return { Component: mod.Component || mod.default }
	} catch {
		return { Component: PageLoader }
	}
}

const ProtectedRoute = () => getAuthToken() ? <Outlet /> : <Navigate to="/login" replace />

const GuestRoute = () => getAuthToken() ? <Navigate to="/home" replace /> : <Outlet />

export const router = createBrowserRouter([
	{
		HydrateFallback: PageLoader,
		children: [
			{ path: '/', lazy: lazyPage(() => import('./pages/Landing')) },
			{
				element: <GuestRoute />,
				children: [
					{ path: '/login', lazy: lazyPage(() => import('./pages/Auth')) },
					{ path: '/register', lazy: lazyPage(() => import('./pages/Auth')) }
				]
			},
			{
				element: <ProtectedRoute />,
				children: [
					{ path: '/home', lazy: lazyPage(() => import('./pages/Home')) },
					{ path: '/veribot', lazy: lazyPage(() => import('./pages/Veribot')) }
				]
			},
			{ path: '*', element: <Navigate to="/" replace /> }
		]
	}
])
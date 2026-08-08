import { createBrowserRouter, RouterProvider } from 'react-router'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Veribot from './pages/Veribot'
import Sources from './pages/Sources'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Statistics from './pages/Statistics'
import Classrooms from './pages/Classrooms'
import Account from './pages/Account'
import Admin from './pages/Admin'
import ProtectedRoute from './utils/ProtectedRoute'

const router = createBrowserRouter([
	{ path: '/', element: <Landing /> },
	{ path: '/login', element: <Login /> },
	{ path: '/register', element: <Register /> },
	{
		element: <ProtectedRoute />,
		children: [
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/home', element: <Home /> },
			{ path: '/veribot', element: <Veribot /> },
			{ path: '/sources', element: <Sources /> },
			{ path: '/history', element: <History /> },
			{ path: '/classrooms', element: <Classrooms /> },
			{ path: '/sections', element: <Classrooms /> },
			{ path: '/statistics', element: <Statistics /> },
			{ path: '/account', element: <Account /> },
			{ path: '/admin', element: <Admin /> }
		]
	}
])

export default function App() {
	return <RouterProvider router={router} />
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Veribot from './pages/Veribot';
import Sources from './pages/Sources';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';

const router = createBrowserRouter([
	{ path: '/', element: <Landing /> },
	{ path: '/dashboard', element: <Dashboard /> },
	{ path: '/login', element: <Login /> },
	{ path: '/register', element: <Register /> },
	{ path: '/home', element: <Home /> },
	{ path: '/veribot', element: <Veribot /> },
	{ path: '/sources', element: <Sources /> },
	{ path: '/history', element: <History /> },
	{ path: '/statistics', element: <Statistics /> },
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
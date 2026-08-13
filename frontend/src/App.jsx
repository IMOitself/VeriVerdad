import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './auth'
import { router } from './router'

const queryClient = new QueryClient()

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</QueryClientProvider>
)
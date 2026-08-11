import { useLogout } from "@/hooks/useAuth"
import { getUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
	const logoutMutation = useLogout()
	const user = getUser()

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Dashboard</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<p className="text-sm text-muted-foreground">
						Welcome, {user?.username || "User"}!
					</p>
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={() => logoutMutation.mutate()}
						disabled={logoutMutation.status === "pending"}
					>
						Logout
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

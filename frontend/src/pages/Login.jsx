import { useForm } from "react-hook-form"
import { useLogin } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export default function Login() {
	const form = useForm({
		defaultValues: { email: "", password: "" },
	})
	const mutation = useLogin()

	const onSubmit = form.handleSubmit((data) => {
		form.clearErrors()
		mutation.mutate(data, {
			onError: (error) => {
				const { errors, message } = error.response?.data || {}
				if (errors) {
					Object.entries(errors).forEach(([field, messages]) => {
						form.setError(field, { type: "server", message: messages[0] })
					})
				} else if (message) {
					form.setError("email", { type: "server", message })
					form.setError("password", { type: "server", message })
				}
			},
		})
	})

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<CardContent className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<Field data-invalid={!!fieldState.error}>
										<FieldLabel htmlFor="email">Email</FieldLabel>
										<Input id="email" type="email" aria-invalid={!!fieldState.error} required {...field} />
										<FieldError error={fieldState.error} />
									</Field>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<Field data-invalid={!!fieldState.error}>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<PasswordInput id="password" aria-invalid={!!fieldState.error} required {...field} />
										<FieldError error={fieldState.error} />
									</Field>
								)}
							/>
						</CardContent>
						<CardFooter className="flex flex-col gap-2">
							<Button type="submit" className="w-full" disabled={mutation.status === "pending"}>
								Login
							</Button>
							<span className="text-sm text-muted-foreground">Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a></span>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	)
}

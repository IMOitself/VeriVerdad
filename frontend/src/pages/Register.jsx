import { useForm } from "react-hook-form"
import { useRegister } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export default function Register() {
	const form = useForm({
		defaultValues: { username: "", email: "", password: "" },
	})
	const mutation = useRegister()

	const onSubmit = form.handleSubmit((data) => {
		form.clearErrors()
		mutation.mutate(data, {
			onError: (error) => {
				const errors = error.response?.data?.errors
				if (errors) Object.entries(errors).forEach(([field, messages]) => form.setError(field, { type: "server", message: messages[0] }))
			},
		})
	})

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Register</CardTitle>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<CardContent className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="username"
								render={({ field, fieldState }) => (
									<Field data-invalid={!!fieldState.error}>
										<FieldLabel htmlFor="username">Username</FieldLabel>
										<Input id="username" aria-invalid={!!fieldState.error} required {...field} />
										<FieldError error={fieldState.error} />
									</Field>
								)}
							/>
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
								Register
							</Button>
							<span className="text-sm text-muted-foreground">Already have an account? <a href="/login" className="text-primary hover:underline">Login</a></span>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	)
}

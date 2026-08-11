import * as React from "react"
import { Controller, FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export const Form = ({ ...props }) => <FormProvider {...props} />
export const FormField = ({ ...props }) => <Controller {...props} />

export function FormItem({ className, ...props }) {
	return (
		<div
			data-slot="form-item"
			className={cn("grid gap-2", className)}
			{...props}
		/>
	)
}

export function FormLabel({ className, ...props }) {
	return (
		<Label
			data-slot="form-label"
			className={cn(className)}
			{...props}
		/>
	)
}

export function FormControl({ ...props }) {
	return <div data-slot="form-control">{props.children}</div>
}

export function FormMessage({ className, ...props }) {
	return (
		<p
			data-slot="form-message"
			className={cn("text-destructive text-sm", className)}
			{...props}
		/>
	)
}

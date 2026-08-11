import * as React from "react"
import { cn } from "@/lib/utils"

function Field({ className, ...props }) {
	return <div data-slot="field" className={cn("grid gap-2", className)} {...props} />
}

function FieldLabel({ className, ...props }) {
	return (
		<label
			data-slot="field-label"
			className={cn("block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)}
			{...props}
		/>
	)
}

function FieldDescription({ className, ...props }) {
	return (
		<p
			data-slot="field-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
}

function FieldGroup({ className, ...props }) {
	return (
		<div
			data-slot="field-group"
			className={cn("grid gap-4", className)}
			{...props}
		/>
	)
}

function FieldError({ className, error, ...props }) {
	return (
		<p
			data-slot="field-error"
			className={cn("text-destructive text-sm leading-none h-4", className)}
			{...props}
		>
			{error?.message}
		</p>
	)
}

export { Field, FieldLabel, FieldDescription, FieldGroup, FieldError }

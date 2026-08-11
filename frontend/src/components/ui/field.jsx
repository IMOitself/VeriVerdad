import * as React from "react"
import { cn } from "@/lib/utils"

export function Field({ className, ...props }) {
	return <div data-slot="field" className={cn("grid gap-2", className)} {...props} />
}

export function FieldLabel({ className, ...props }) {
	return (
		<label
			data-slot="field-label"
			className={cn("block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)}
			{...props}
		/>
	)
}

export function FieldDescription({ className, ...props }) {
	return (
		<p
			data-slot="field-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
}

export function FieldGroup({ className, ...props }) {
	return (
		<div
			data-slot="field-group"
			className={cn("grid gap-4", className)}
			{...props}
		/>
	)
}

export function FieldError({ className, error, ...props }) {
	return (
		<p
			data-slot="field-error"
			className={cn("text-destructive text-sm leading-none h-4", className)}
			{...props}>
			{error?.message}
		</p>
	)
}

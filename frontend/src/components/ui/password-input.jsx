import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function PasswordInput({ className, ...props }) {
	const [visible, setVisible] = React.useState(false)

	return (
		<div className="relative">
			<Input
				type={visible ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute inset-y-0 right-0 flex h-full w-8 items-center justify-center p-0 text-muted-foreground"
				onClick={() => setVisible((v) => !v)}
				tabIndex={-1}
			>
				{visible ? <EyeOff size={16} /> : <Eye size={16} />}
			</Button>
		</div>
	)
}

export { PasswordInput }

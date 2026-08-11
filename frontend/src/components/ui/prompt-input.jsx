import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function PromptInput({
  className,
  onSubmit,
  children,
  ...props
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  return (
    <form
      className={cn("w-full", className)}
      onSubmit={handleSubmit}
      {...props}>
      {children}
    </form>
  )
}

export function PromptInputBody({ className, ...props }) {
  return (
    <div className={cn("flex items-end gap-2", className)} {...props} />
  )
}

export const PromptInputTextarea = React.forwardRef(function PromptInputTextarea({
  className,
  placeholder = "Ask VeriVerdad...",
  ...props
}, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "field-sizing-content max-h-48 min-h-16 flex-1 resize-none rounded-lg border border-input bg-transparent px-2 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      name="message"
      placeholder={placeholder}
      rows={1}
      {...props} />
  )
})

export function PromptInputFooter({ className, ...props }) {
  return (
    <div className={cn("flex justify-end", className)} {...props} />
  )
}

export function PromptInputSubmit({
  className,
  status,
  onStop,
  children,
  ...props
}) {
  const isGenerating = status === "submitted" || status === "streaming"

  return (
    <Button
      aria-label={isGenerating ? "Stop" : "Submit"}
      className={cn(className)}
      size="icon-sm"
      type={isGenerating && onStop ? "button" : "submit"}
      variant="default"
      onClick={(e) => {
        if (isGenerating && onStop) {
          e.preventDefault()
          onStop()
        }
      }}
      {...props}>
      {children}
    </Button>
  )
}

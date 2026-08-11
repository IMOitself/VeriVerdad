import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrainIcon, ChevronDownIcon } from "lucide-react"

export function Reasoning({
  className,
  isStreaming = false,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? isStreaming)

  React.useEffect(() => {
    if (isStreaming && !isOpen) {
      setIsOpen(true)
    }
  }, [isStreaming, isOpen])

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div
      data-slot="reasoning"
      className={cn("not-prose mb-4", className)}
      {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            onOpenChange: handleOpenChange,
          })
        }
        return child
      })}
    </div>
  )
}

export function ReasoningTrigger({
  className,
  children,
  isOpen,
  onOpenChange,
  ...props
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
        className
      )}
      onClick={() => onOpenChange?.(!isOpen)}
      {...props}>
      {children ?? (
        <>
          <BrainIcon className="size-4" />
          <span>Thought for a few seconds</span>
          <ChevronDownIcon
            className={cn("size-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")} />
        </>
      )}
    </Button>
  )
}

export function ReasoningContent({
  className,
  children,
  isOpen,
  ...props
}) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "mt-4 text-sm text-muted-foreground",
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

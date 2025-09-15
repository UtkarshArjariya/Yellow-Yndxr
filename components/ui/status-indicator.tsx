import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "active" | "inactive" | "error" | "warning" | "success"
  label?: string
  showDot?: boolean
  className?: string
}

const statusConfig = {
  active: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  inactive: {
    color: "bg-gray-400",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
  },
  error: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
  warning: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  success: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
}

export function StatusIndicator({ status, label, showDot = true, className }: StatusIndicatorProps) {
  const config = statusConfig[status]

  if (!label) {
    return (
      <div className={cn("flex items-center", className)}>
        <div className={cn("h-2 w-2 rounded-full", config.color)} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium",
        config.bgColor,
        config.textColor,
        className,
      )}
    >
      {showDot && <div className={cn("h-2 w-2 rounded-full", config.color)} />}
      {label}
    </div>
  )
}

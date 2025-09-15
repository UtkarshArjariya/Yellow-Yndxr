"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimeRange {
  label: string
  value: string
  duration: number // in minutes
}

interface TimeRangeSelectorProps {
  value?: string
  onChange?: (value: string) => void
  ranges?: TimeRange[]
  className?: string
}

const defaultRanges: TimeRange[] = [
  { label: "15m", value: "15m", duration: 15 },
  { label: "1h", value: "1h", duration: 60 },
  { label: "24h", value: "24h", duration: 1440 },
  { label: "7d", value: "7d", duration: 10080 },
  { label: "30d", value: "30d", duration: 43200 },
]

export function TimeRangeSelector({
  value = "24h",
  onChange,
  ranges = defaultRanges,
  className,
}: TimeRangeSelectorProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-md border p-1", className)}>
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={value === range.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange?.(range.value)}
          className={cn("h-7 px-3 text-xs", value === range.value && "bg-primary text-primary-foreground")}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}

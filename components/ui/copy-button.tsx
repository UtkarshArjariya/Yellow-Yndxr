"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function CopyButton({ value, className, size = "sm", variant = "ghost" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={cn("h-6 w-6 p-0", className)}>
      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  )
}

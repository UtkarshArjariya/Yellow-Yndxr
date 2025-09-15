"use client"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface ActiveFilter {
  key: string
  value: string
  label: string
}

interface FilterToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: {
    key: string
    label: string
    options: FilterOption[]
    value?: string
    onChange: (value: string) => void
  }[]
  activeFilters?: ActiveFilter[]
  onClearFilter?: (key: string) => void
  onClearAll?: () => void
  className?: string
}

export function FilterToolbar({
  searchValue = "",
  onSearchChange,
  filters = [],
  activeFilters = [],
  onClearFilter,
  onClearAll,
  className,
}: FilterToolbarProps) {
  const hasActiveFilters = activeFilters.length > 0 || searchValue.length > 0

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder="Search..." className="max-w-sm" />
          {filters.map((filter) => (
            <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearAll} size="sm">
            Clear all
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.map((filter) => (
            <Badge key={`${filter.key}-${filter.value}`} variant="secondary" className="gap-1">
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => onClearFilter?.(filter.key)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

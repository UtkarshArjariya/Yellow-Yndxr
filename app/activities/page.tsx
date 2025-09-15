"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/ui/data-table"
import { FilterToolbar } from "@/components/ui/filter-toolbar"
import { TimeRangeSelector } from "@/components/ui/time-range-selector"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { EmptyState } from "@/components/ui/empty-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Activity, RefreshCw, Download } from "lucide-react"

interface ActivityRecord {
  id: string
  channelId: string
  channelName: string
  type: "message" | "update" | "alert"
  timestamp: string
  payload: string
  metadata?: Record<string, any>
}

// Mock data
const mockActivities: ActivityRecord[] = [
  {
    id: "act_001",
    channelId: "ch_001",
    channelName: "Main Trading Channel",
    type: "message",
    timestamp: "2024-01-15T10:30:00Z",
    payload: "New trade executed: 1000 YELLOW tokens at $0.45",
    metadata: { tradeId: "trade_123", volume: 1000, price: 0.45 },
  },
  {
    id: "act_002",
    channelId: "ch_003",
    channelName: "NFT Marketplace",
    type: "update",
    timestamp: "2024-01-15T10:29:45Z",
    payload: "NFT metadata updated for collection #456",
    metadata: { collectionId: 456, updateType: "metadata" },
  },
  {
    id: "act_003",
    channelId: "ch_002",
    channelName: "DeFi Protocol Hub",
    type: "alert",
    timestamp: "2024-01-15T10:29:30Z",
    payload: "High volume detected: 50,000 YELLOW in last 5 minutes",
    metadata: { volume: 50000, timeWindow: "5m", threshold: 25000 },
  },
  {
    id: "act_004",
    channelId: "ch_001",
    channelName: "Main Trading Channel",
    type: "message",
    timestamp: "2024-01-15T10:29:15Z",
    payload: "Liquidity pool rebalanced: YELLOW/USDC ratio adjusted",
    metadata: { poolId: "pool_789", oldRatio: 0.6, newRatio: 0.65 },
  },
  {
    id: "act_005",
    channelId: "ch_005",
    channelName: "Analytics Feed",
    type: "update",
    timestamp: "2024-01-15T10:29:00Z",
    payload: "Analytics report generated for trading volume",
    metadata: { reportId: "rpt_101", period: "24h", volume: 125000 },
  },
  {
    id: "act_006",
    channelId: "ch_004",
    channelName: "Governance Channel",
    type: "message",
    timestamp: "2024-01-15T10:28:45Z",
    payload: "New governance proposal submitted: Increase staking rewards",
    metadata: { proposalId: "prop_42", type: "staking", status: "pending" },
  },
  {
    id: "act_007",
    channelId: "ch_002",
    channelName: "DeFi Protocol Hub",
    type: "update",
    timestamp: "2024-01-15T10:28:30Z",
    payload: "Smart contract upgraded to version 2.1.0",
    metadata: { contractAddress: "0x123...abc", version: "2.1.0" },
  },
  {
    id: "act_008",
    channelId: "ch_003",
    channelName: "NFT Marketplace",
    type: "message",
    timestamp: "2024-01-15T10:28:15Z",
    payload: "NFT sold: CryptoPunk #1234 for 50 YELLOW",
    metadata: { nftId: 1234, price: 50, buyer: "0x456...def" },
  },
]

const typeOptions = [
  { value: "message", label: "Message" },
  { value: "update", label: "Update" },
  { value: "alert", label: "Alert" },
]

const channelOptions = [
  { value: "ch_001", label: "Main Trading Channel" },
  { value: "ch_002", label: "DeFi Protocol Hub" },
  { value: "ch_003", label: "NFT Marketplace" },
  { value: "ch_004", label: "Governance Channel" },
  { value: "ch_005", label: "Analytics Feed" },
]

export default function ActivitiesPage() {
  const searchParams = useSearchParams()
  const channelFilter = searchParams.get("channel") || "all"

  const [searchValue, setSearchValue] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [selectedChannelFilter, setSelectedChannelFilter] = React.useState(channelFilter)
  const [timeRange, setTimeRange] = React.useState("24h")
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState<ActivityRecord[]>(mockActivities)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // In a real app, this would trigger a CSV/JSON export
    console.log("Exporting activities...")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const columns: ColumnDef<ActivityRecord>[] = [
    {
      accessorKey: "id",
      header: "Event ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{row.getValue("id")}</code>
          <CopyButton value={row.getValue("id")} />
        </div>
      ),
    },
    {
      accessorKey: "channelName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <Link
            href={`/channels/${row.original.channelId}`}
            className="font-medium hover:text-primary transition-colors block"
          >
            {row.getValue("channelName")}
          </Link>
          <code className="text-xs text-muted-foreground font-mono">{row.original.channelId}</code>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("type") === "alert"
              ? "destructive"
              : row.getValue("type") === "update"
                ? "yellow"
                : "secondary"
          }
        >
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-mono text-sm">{formatDate(row.getValue("timestamp"))}</div>
          <div className="text-xs text-muted-foreground">{formatRelativeTime(row.getValue("timestamp"))}</div>
        </div>
      ),
    },
    {
      accessorKey: "payload",
      header: "Payload",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="text-sm" title={row.getValue("payload")}>
            {(row.getValue("payload") as string).length > 60
              ? `${(row.getValue("payload") as string).substring(0, 60)}...`
              : row.getValue("payload")}
          </p>
          {row.original.metadata && (
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(row.original.metadata)
                .slice(0, 2)
                .map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {String(value)}
                  </Badge>
                ))}
              {Object.keys(row.original.metadata).length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{Object.keys(row.original.metadata).length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      ),
    },
  ]

  // Filter data based on search, type, and channel
  const filteredData = React.useMemo(() => {
    return data.filter((activity) => {
      const matchesSearch =
        activity.payload.toLowerCase().includes(searchValue.toLowerCase()) ||
        activity.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        activity.channelName.toLowerCase().includes(searchValue.toLowerCase())

      const matchesType = typeFilter === "all" || activity.type === typeFilter
      const matchesChannel = selectedChannelFilter === "all" || activity.channelId === selectedChannelFilter

      return matchesSearch && matchesType && matchesChannel
    })
  }, [data, searchValue, typeFilter, selectedChannelFilter])

  const activeFilters = React.useMemo(() => {
    const filters = []
    if (typeFilter !== "all") {
      filters.push({
        key: "type",
        value: typeFilter,
        label: `Type: ${typeFilter}`,
      })
    }
    if (selectedChannelFilter !== "all") {
      const channelName = channelOptions.find((c) => c.value === selectedChannelFilter)?.label || selectedChannelFilter
      filters.push({
        key: "channel",
        value: selectedChannelFilter,
        label: `Channel: ${channelName}`,
      })
    }
    return filters
  }, [typeFilter, selectedChannelFilter])

  const handleClearFilter = (key: string) => {
    if (key === "type") {
      setTypeFilter("all")
    } else if (key === "channel") {
      setSelectedChannelFilter("all")
    }
  }

  const handleClearAll = () => {
    setSearchValue("")
    setTypeFilter("all")
    setSelectedChannelFilter("all")
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title="Activities" description="Explore and analyze all blockchain activities across Yellow Chain">
        <div className="flex items-center gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </PageHeader>

      <FilterToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={[
          {
            key: "type",
            label: "Type",
            options: typeOptions,
            value: typeFilter,
            onChange: setTypeFilter,
          },
          {
            key: "channel",
            label: "Channel",
            options: channelOptions,
            value: selectedChannelFilter,
            onChange: setSelectedChannelFilter,
          },
        ]}
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAll}
      />

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-12 w-12" />}
          title="No activities found"
          description="No activities match your current filters. Try adjusting your search criteria or time range."
          action={{
            label: "Clear filters",
            onClick: handleClearAll,
          }}
        />
      ) : (
        <DataTable columns={columns} data={filteredData} searchKey="payload" searchPlaceholder="Search activities..." />
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/ui/data-table"
import { FilterToolbar } from "@/components/ui/filter-toolbar"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { CopyButton } from "@/components/ui/copy-button"
import { EmptyState } from "@/components/ui/empty-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink, Database, RefreshCw } from "lucide-react"

interface Channel {
  id: string
  name: string
  status: "active" | "inactive"
  createdAt: string
  lastActivityAt: string
  totalActivities: number
  throughput: number
}

// Mock data
const mockChannels: Channel[] = [
  {
    id: "ch_001",
    name: "Main Trading Channel",
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
    lastActivityAt: "2024-01-15T10:30:00Z",
    totalActivities: 15420,
    throughput: 125.5,
  },
  {
    id: "ch_002",
    name: "DeFi Protocol Hub",
    status: "active",
    createdAt: "2024-01-08T14:30:00Z",
    lastActivityAt: "2024-01-15T10:25:00Z",
    totalActivities: 12890,
    throughput: 98.2,
  },
  {
    id: "ch_003",
    name: "NFT Marketplace",
    status: "active",
    createdAt: "2024-01-12T09:15:00Z",
    lastActivityAt: "2024-01-15T10:31:00Z",
    totalActivities: 8765,
    throughput: 67.3,
  },
  {
    id: "ch_004",
    name: "Governance Channel",
    status: "inactive",
    createdAt: "2024-01-05T16:45:00Z",
    lastActivityAt: "2024-01-15T08:30:00Z",
    totalActivities: 4321,
    throughput: 0,
  },
  {
    id: "ch_005",
    name: "Analytics Feed",
    status: "active",
    createdAt: "2024-01-14T11:20:00Z",
    lastActivityAt: "2024-01-15T10:29:30Z",
    totalActivities: 3456,
    throughput: 45.8,
  },
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function ChannelsPage() {
  const [searchValue, setSearchValue] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState<Channel[]>(mockChannels)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  const columns: ColumnDef<Channel>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Channel ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{row.getValue("id")}</code>
          <CopyButton value={row.getValue("id")} />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link href={`/channels/${row.getValue("id")}`} className="font-medium hover:text-primary transition-colors">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusIndicator status={row.getValue("status")} label={row.getValue("status")} />,
    },
    {
      accessorKey: "totalActivities",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Activities
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono">{(row.getValue("totalActivities") as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "throughput",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Throughput
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const throughput = row.getValue("throughput") as number
        return <span className="font-mono">{throughput > 0 ? `${throughput}/min` : "—"}</span>
      },
    },
    {
      accessorKey: "lastActivityAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Last Activity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{formatRelativeTime(row.getValue("lastActivityAt"))}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/channels/${row.getValue("id")}`}>
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View channel details</span>
          </Link>
        </Button>
      ),
    },
  ]

  // Filter data based on search and status
  const filteredData = React.useMemo(() => {
    return data.filter((channel) => {
      const matchesSearch =
        channel.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        channel.id.toLowerCase().includes(searchValue.toLowerCase())

      const matchesStatus = statusFilter === "all" || channel.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [data, searchValue, statusFilter])

  const activeFilters = React.useMemo(() => {
    const filters = []
    if (statusFilter !== "all") {
      filters.push({
        key: "status",
        value: statusFilter,
        label: `Status: ${statusFilter}`,
      })
    }
    return filters
  }, [statusFilter])

  const handleClearFilter = (key: string) => {
    if (key === "status") {
      setStatusFilter("all")
    }
  }

  const handleClearAll = () => {
    setSearchValue("")
    setStatusFilter("all")
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title="Channels" description="Monitor and manage all Yellow Chain channels">
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>

      <FilterToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={[
          {
            key: "status",
            label: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAll}
      />

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="No channels found"
          description="No channels match your current filters. Try adjusting your search criteria."
          action={{
            label: "Clear filters",
            onClick: handleClearAll,
          }}
        />
      ) : (
        <DataTable columns={columns} data={filteredData} searchKey="name" searchPlaceholder="Search channels..." />
      )}
    </div>
  )
}

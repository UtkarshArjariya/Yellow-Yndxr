"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { CopyButton } from "@/components/ui/copy-button"
import { DataTable } from "@/components/ui/data-table"
import { EmptyState } from "@/components/ui/empty-state"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowLeft, Activity, Calendar, Clock, TrendingUp, ExternalLink } from "lucide-react"

interface ChannelDetails {
  id: string
  name: string
  status: "active" | "inactive"
  createdAt: string
  lastActivityAt: string
  totalActivities: number
  throughput: number
  description?: string
  metadata: Record<string, any>
}

interface ChannelActivity {
  id: string
  type: "message" | "update" | "alert"
  timestamp: string
  payload: string
}

// Mock data
const mockChannelDetails: ChannelDetails = {
  id: "ch_001",
  name: "Main Trading Channel",
  status: "active",
  createdAt: "2024-01-10T08:00:00Z",
  lastActivityAt: "2024-01-15T10:30:00Z",
  totalActivities: 15420,
  throughput: 125.5,
  description: "Primary channel for handling trading activities and order processing on Yellow Chain",
  metadata: {
    version: "1.2.0",
    protocol: "trading-v2",
    maintainer: "yellow-team",
    tags: ["trading", "orders", "high-volume"],
  },
}

const mockActivities: ChannelActivity[] = [
  {
    id: "act_001",
    type: "message",
    timestamp: "2024-01-15T10:30:00Z",
    payload: "New trade executed: 1000 YELLOW tokens at $0.45",
  },
  {
    id: "act_002",
    type: "update",
    timestamp: "2024-01-15T10:29:45Z",
    payload: "Order book updated with 15 new limit orders",
  },
  {
    id: "act_003",
    type: "alert",
    timestamp: "2024-01-15T10:29:30Z",
    payload: "High volume detected: 50,000 YELLOW in last 5 minutes",
  },
  {
    id: "act_004",
    type: "message",
    timestamp: "2024-01-15T10:29:15Z",
    payload: "Liquidity pool rebalanced: YELLOW/USDC ratio adjusted",
  },
  {
    id: "act_005",
    type: "update",
    timestamp: "2024-01-15T10:29:00Z",
    payload: "Price oracle updated: $0.45 (+2.3%)",
  },
]

export default function ChannelDetailPage() {
  const params = useParams()
  const channelId = params.id as string

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

  const columns: ColumnDef<ChannelActivity>[] = [
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
      header: "Timestamp",
      cell: ({ row }) => <span className="font-mono text-sm">{formatDate(row.getValue("timestamp"))}</span>,
    },
    {
      accessorKey: "payload",
      header: "Payload",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="text-sm truncate" title={row.getValue("payload")}>
            {row.getValue("payload")}
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title={mockChannelDetails.name} description={mockChannelDetails.description}>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/channels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Channels
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/activities?channel=${channelId}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Activities
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Channel Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Channel Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Channel ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded flex-1">{mockChannelDetails.id}</code>
                  <CopyButton value={mockChannelDetails.id} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <StatusIndicator status={mockChannelDetails.status} label={mockChannelDetails.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono">{formatDate(mockChannelDetails.createdAt)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatRelativeTime(mockChannelDetails.lastActivityAt)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Activities</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-mono">{mockChannelDetails.totalActivities.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Throughput</label>
                <div className="mt-1 text-sm font-mono">
                  {mockChannelDetails.throughput > 0 ? `${mockChannelDetails.throughput}/min` : "—"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(mockChannelDetails.metadata).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <div className="mt-1">
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm font-mono">{String(value)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest activities from this channel</CardDescription>
            </CardHeader>
            <CardContent>
              {mockActivities.length === 0 ? (
                <EmptyState
                  icon={<Activity className="h-12 w-12" />}
                  title="No activities found"
                  description="This channel hasn't recorded any activities yet."
                />
              ) : (
                <DataTable
                  columns={columns}
                  data={mockActivities}
                  searchKey="payload"
                  searchPlaceholder="Search activities..."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

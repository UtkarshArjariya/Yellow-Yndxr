"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TimeRangeSelector } from "@/components/ui/time-range-selector"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { CopyButton } from "@/components/ui/copy-button"
import { StatCardSkeleton } from "@/components/ui/loading-skeleton"
import { Activity, Database, Clock, Zap, TrendingUp, Users, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from API
const mockStats = {
  totalChannels: 1247,
  totalActivities: 892456,
  indexingLag: 45,
  apiLatency: 89,
}

const mockTopChannels = [
  {
    id: "ch_001",
    name: "Main Trading Channel",
    status: "active" as const,
    activities: 15420,
    lastActivity: "2 min ago",
  },
  { id: "ch_002", name: "DeFi Protocol Hub", status: "active" as const, activities: 12890, lastActivity: "5 min ago" },
  { id: "ch_003", name: "NFT Marketplace", status: "active" as const, activities: 8765, lastActivity: "1 min ago" },
  {
    id: "ch_004",
    name: "Governance Channel",
    status: "inactive" as const,
    activities: 4321,
    lastActivity: "2 hours ago",
  },
  { id: "ch_005", name: "Analytics Feed", status: "active" as const, activities: 3456, lastActivity: "30 sec ago" },
]

const mockRecentActivities = [
  {
    id: "act_001",
    channelId: "ch_001",
    type: "message",
    timestamp: "2024-01-15T10:30:00Z",
    payload: "New trade executed: 1000 YELLOW",
  },
  {
    id: "act_002",
    channelId: "ch_003",
    type: "update",
    timestamp: "2024-01-15T10:29:45Z",
    payload: "NFT metadata updated",
  },
  {
    id: "act_003",
    channelId: "ch_002",
    type: "alert",
    timestamp: "2024-01-15T10:29:30Z",
    payload: "High volume detected",
  },
  {
    id: "act_004",
    channelId: "ch_001",
    type: "message",
    timestamp: "2024-01-15T10:29:15Z",
    payload: "Liquidity pool rebalanced",
  },
  {
    id: "act_005",
    channelId: "ch_005",
    type: "update",
    timestamp: "2024-01-15T10:29:00Z",
    payload: "Analytics report generated",
  },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState("24h")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader title="Dashboard" description="Monitor Yellow Chain indexer performance and activity">
        <div className="flex items-center gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Channels"
              value={mockStats.totalChannels.toLocaleString()}
              description="Active blockchain channels"
              icon={<Database className="h-4 w-4" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Activities"
              value={mockStats.totalActivities.toLocaleString()}
              description="Indexed activities"
              icon={<Activity className="h-4 w-4" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Indexing Lag"
              value={`${mockStats.indexingLag}ms`}
              description="Average processing delay"
              icon={<Clock className="h-4 w-4" />}
              trend={{ value: 5, isPositive: false }}
            />
            <StatCard
              title="API Latency"
              value={`${mockStats.apiLatency}ms`}
              description="Average response time"
              icon={<Zap className="h-4 w-4" />}
              trend={{ value: 3, isPositive: false }}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Channels */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Channels
              </CardTitle>
              <CardDescription>Most active channels in the last {timeRange}</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/channels">
                View All
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopChannels.map((channel, index) => (
                <div key={channel.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/channels/${channel.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {channel.name}
                        </Link>
                        <StatusIndicator status={channel.status} />
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {channel.id}
                        <CopyButton value={channel.id} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium font-mono">{channel.activities.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{channel.lastActivity}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest indexed activities</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/activities">
                View All
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Badge
                    variant={
                      activity.type === "alert" ? "destructive" : activity.type === "update" ? "yellow" : "secondary"
                    }
                    className="mt-0.5"
                  >
                    {activity.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/channels/${activity.channelId}`}
                        className="text-sm font-medium font-mono hover:text-primary transition-colors"
                      >
                        {activity.channelId}
                      </Link>
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.payload}</p>
                  </div>
                  <CopyButton value={activity.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>Current system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Indexer Service</div>
                <div className="text-sm text-muted-foreground">Processing blocks</div>
              </div>
              <StatusIndicator status="active" label="Running" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">GraphQL API</div>
                <div className="text-sm text-muted-foreground">Serving requests</div>
              </div>
              <StatusIndicator status="active" label="Healthy" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Database</div>
                <div className="text-sm text-muted-foreground">Postgres + TimescaleDB</div>
              </div>
              <StatusIndicator status="active" label="Connected" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

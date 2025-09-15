"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { StatCard } from "@/components/ui/stat-card"
import { TimeRangeSelector } from "@/components/ui/time-range-selector"
import {
  Server,
  Database,
  Zap,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface ServiceStatus {
  name: string
  status: "active" | "inactive" | "warning" | "error"
  description: string
  lastChecked: string
  responseTime?: number
  uptime?: number
  details?: Record<string, any>
}

interface SystemMetric {
  name: string
  value: string | number
  unit?: string
  status: "success" | "warning" | "error"
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Mock data
const mockServices: ServiceStatus[] = [
  {
    name: "Indexer Service",
    status: "active",
    description: "Processing blockchain blocks and indexing activities",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 45,
    uptime: 99.9,
    details: {
      currentBlock: 1234567,
      blocksPerSecond: 12.5,
      queueSize: 23,
    },
  },
  {
    name: "GraphQL API",
    status: "active",
    description: "Serving API requests and queries",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 89,
    uptime: 99.8,
    details: {
      requestsPerMinute: 450,
      activeConnections: 127,
      cacheHitRate: 0.85,
    },
  },
  {
    name: "PostgreSQL Database",
    status: "active",
    description: "Primary database for indexed data",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 12,
    uptime: 99.95,
    details: {
      connections: 45,
      maxConnections: 100,
      diskUsage: 0.67,
    },
  },
  {
    name: "TimescaleDB Extension",
    status: "active",
    description: "Time-series data optimization",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 8,
    uptime: 99.9,
    details: {
      compressionRatio: 0.23,
      retentionPolicy: "90 days",
      chunks: 1247,
    },
  },
  {
    name: "Redis Cache",
    status: "warning",
    description: "Caching layer for improved performance",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 156,
    uptime: 98.5,
    details: {
      memoryUsage: 0.89,
      hitRate: 0.72,
      evictions: 234,
    },
  },
  {
    name: "Monitoring Service",
    status: "active",
    description: "System monitoring and alerting",
    lastChecked: "2024-01-15T10:30:00Z",
    responseTime: 67,
    uptime: 99.7,
    details: {
      activeAlerts: 1,
      metricsCollected: 15420,
      lastAlert: "2024-01-15T09:15:00Z",
    },
  },
]

const mockMetrics: SystemMetric[] = [
  {
    name: "Overall Uptime",
    value: 99.8,
    unit: "%",
    status: "success",
    description: "System availability over the last 30 days",
    trend: { value: 0.2, isPositive: true },
  },
  {
    name: "Average Response Time",
    value: 89,
    unit: "ms",
    status: "success",
    description: "API response time across all endpoints",
    trend: { value: 5, isPositive: false },
  },
  {
    name: "Indexing Lag",
    value: 45,
    unit: "ms",
    status: "success",
    description: "Delay between block creation and indexing",
    trend: { value: 12, isPositive: false },
  },
  {
    name: "Error Rate",
    value: 0.02,
    unit: "%",
    status: "success",
    description: "Percentage of failed requests in the last hour",
    trend: { value: 0.01, isPositive: false },
  },
]

export default function HealthPage() {
  const [timeRange, setTimeRange] = React.useState("24h")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState(new Date())

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    return `${Math.floor(diffInMinutes / 60)}h ago`
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  const overallStatus = mockServices.every((s) => s.status === "active")
    ? "active"
    : mockServices.some((s) => s.status === "error")
      ? "error"
      : "warning"

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title="System Health" description="Monitor the status and performance of all Yndxr services">
        <div className="flex items-center gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </PageHeader>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(overallStatus)}
                System Status
              </CardTitle>
              <CardDescription>Overall system health and availability</CardDescription>
            </div>
            <div className="text-right">
              <StatusIndicator
                status={overallStatus}
                label={overallStatus === "active" ? "All Systems Operational" : "Issues Detected"}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {formatRelativeTime(lastUpdated.toISOString())}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockMetrics.map((metric) => (
          <StatCard
            key={metric.name}
            title={metric.name}
            value={`${metric.value}${metric.unit || ""}`}
            description={metric.description}
            trend={metric.trend}
            className={
              metric.status === "error"
                ? "border-red-200"
                : metric.status === "warning"
                  ? "border-yellow-200"
                  : "border-green-200"
            }
          />
        ))}
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Status
          </CardTitle>
          <CardDescription>Individual service health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {mockServices.map((service) => (
              <Card key={service.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {service.name.includes("Database") && <Database className="h-4 w-4" />}
                      {service.name.includes("API") && <Zap className="h-4 w-4" />}
                      {service.name.includes("Indexer") && <Activity className="h-4 w-4" />}
                      {service.name.includes("Cache") && <Server className="h-4 w-4" />}
                      {service.name.includes("Monitoring") && <TrendingUp className="h-4 w-4" />}
                      {service.name.includes("TimescaleDB") && <Clock className="h-4 w-4" />}
                      <CardTitle className="text-base">{service.name}</CardTitle>
                    </div>
                    <StatusIndicator status={service.status} />
                  </div>
                  <CardDescription className="text-sm">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-mono">{service.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-mono">{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Checked</span>
                      <span className="font-mono text-xs">{formatRelativeTime(service.lastChecked)}</span>
                    </div>

                    {service.details && (
                      <div className="pt-2 border-t">
                        <div className="grid gap-2">
                          {Object.entries(service.details)
                            .slice(0, 2)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="font-mono">
                                  {typeof value === "number" && value < 1 && value > 0
                                    ? `${Math.round(value * 100)}%`
                                    : String(value)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Incidents
              </CardTitle>
              <CardDescription>System incidents and maintenance events</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Redis Cache Performance Degradation</span>
                  <Badge variant="outline" className="text-xs">
                    Monitoring
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Increased response times detected in Redis cache layer. Investigating potential memory pressure.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Started: 2024-01-15T09:15:00Z</span>
                  <span>Duration: 1h 15m</span>
                  <span>Impact: Low</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Scheduled Database Maintenance</span>
                  <Badge variant="outline" className="text-xs">
                    Resolved
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Routine database optimization and index rebuilding completed successfully.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Completed: 2024-01-14T02:30:00Z</span>
                  <span>Duration: 45m</span>
                  <span>Impact: None</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

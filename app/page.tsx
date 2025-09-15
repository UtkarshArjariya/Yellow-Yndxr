import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, BarChart3, Database, Search, Zap, ArrowRight, TrendingUp, Shield, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Yndxr</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore and analyze Yellow Chain blockchain activities with our powerful indexer dashboard. Real-time data,
            comprehensive analytics, and developer-friendly APIs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Open Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px] bg-transparent">
            <Link href="/api-explorer">
              <Zap className="mr-2 h-4 w-4" />
              API Explorer
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="font-mono">
            v1.0.0
          </Badge>
          <span>•</span>
          <span>Real-time indexing</span>
          <span>•</span>
          <span>GraphQL API</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3 py-12">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Channel Management</CardTitle>
            </div>
            <CardDescription>
              Monitor and analyze all Yellow Chain channels with real-time status updates and activity tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/channels">
                Explore Channels
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Activity Explorer</CardTitle>
            </div>
            <CardDescription>
              Deep dive into blockchain activities with advanced filtering, search, and real-time updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/activities">
                View Activities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Advanced Search</CardTitle>
            </div>
            <CardDescription>
              Powerful search capabilities across all indexed data with intelligent filtering and faceted results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/search">
                Start Searching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="py-12 border-t">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Trusted by Developers</h2>
          <p className="text-muted-foreground">
            Powering blockchain analytics and integrations across the Yellow Chain ecosystem
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">1M+</div>
            <div className="text-sm text-muted-foreground">Indexed Activities</div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">&lt;100ms</div>
            <div className="text-sm text-muted-foreground">API Response</div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}

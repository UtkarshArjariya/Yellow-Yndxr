"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/ui/copy-button"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Code, Book, Zap, Database, Activity } from "lucide-react"

const exampleQueries = {
  channels: {
    name: "Get All Channels",
    query: `query GetChannels {
  channels {
    id
    name
    status
    createdAt
    lastActivityAt
    totalActivities
    throughput
  }
}`,
    description: "Retrieve all channels with their basic information and statistics",
  },
  channelById: {
    name: "Get Channel by ID",
    query: `query GetChannel($id: String!) {
  channel(id: $id) {
    id
    name
    status
    createdAt
    lastActivityAt
    totalActivities
    throughput
    metadata
    recentActivities(limit: 10) {
      id
      type
      timestamp
      payload
    }
  }
}`,
    variables: `{
  "id": "ch_001"
}`,
    description: "Get detailed information about a specific channel including recent activities",
  },
  activities: {
    name: "Get Recent Activities",
    query: `query GetActivities($limit: Int, $channelId: String, $type: ActivityType) {
  activities(limit: $limit, channelId: $channelId, type: $type) {
    id
    channelId
    type
    timestamp
    payload
    metadata
  }
}`,
    variables: `{
  "limit": 20,
  "channelId": "ch_001",
  "type": "MESSAGE"
}`,
    description: "Fetch recent activities with optional filtering by channel and type",
  },
  stats: {
    name: "Get System Statistics",
    query: `query GetStats {
  stats {
    totalChannels
    totalActivities
    indexingLag
    apiLatency
    activeChannels
    throughputPerMinute
  }
}`,
    description: "Get overall system statistics and performance metrics",
  },
}

export default function APIExplorerPage() {
  const [selectedQuery, setSelectedQuery] = React.useState("channels")
  const [query, setQuery] = React.useState(exampleQueries.channels.query)
  const [variables, setVariables] = React.useState("")
  const [response, setResponse] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [endpoint, setEndpoint] = React.useState("http://localhost:4000/graphql")

  const handleQuerySelect = (queryKey: string) => {
    const selectedExample = exampleQueries[queryKey as keyof typeof exampleQueries]
    setSelectedQuery(queryKey)
    setQuery(selectedExample.query)
    setVariables(selectedExample.variables || "")
  }

  const handleRunQuery = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        data: {
          channels: [
            {
              id: "ch_001",
              name: "Main Trading Channel",
              status: "ACTIVE",
              createdAt: "2024-01-10T08:00:00Z",
              lastActivityAt: "2024-01-15T10:30:00Z",
              totalActivities: 15420,
              throughput: 125.5,
            },
            {
              id: "ch_002",
              name: "DeFi Protocol Hub",
              status: "ACTIVE",
              createdAt: "2024-01-08T14:30:00Z",
              lastActivityAt: "2024-01-15T10:25:00Z",
              totalActivities: 12890,
              throughput: 98.2,
            },
          ],
        },
      }

      setResponse(JSON.stringify(mockResponse, null, 2))
      setIsLoading(false)
    }, 1000)
  }

  const handleCopyQuery = () => {
    const fullQuery = variables ? `${query}\n\nVariables:\n${variables}` : query
    navigator.clipboard.writeText(fullQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title="API Explorer" description="Explore and test the Yndxr GraphQL API">
        <div className="flex items-center gap-2">
          <StatusIndicator status="active" label="API Online" />
          <Badge variant="outline" className="font-mono">
            GraphQL
          </Badge>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Query Examples Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Example Queries
              </CardTitle>
              <CardDescription>Select a query to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(exampleQueries).map(([key, example]) => (
                <Button
                  key={key}
                  variant={selectedQuery === key ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleQuerySelect(key)}
                >
                  {key === "channels" && <Database className="h-4 w-4 mr-2" />}
                  {key === "channelById" && <Database className="h-4 w-4 mr-2" />}
                  {key === "activities" && <Activity className="h-4 w-4 mr-2" />}
                  {key === "stats" && <Zap className="h-4 w-4 mr-2" />}
                  {example.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>API Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Endpoint</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm bg-muted px-2 py-1 rounded">{endpoint}</code>
                  <CopyButton value={endpoint} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Authentication</label>
                <p className="text-sm mt-1">No authentication required for public queries</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Rate Limits</label>
                <p className="text-sm mt-1">1000 requests per hour</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Query Editor and Response */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Query Editor
                  </CardTitle>
                  <CardDescription>
                    {exampleQueries[selectedQuery as keyof typeof exampleQueries]?.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleCopyQuery} variant="outline" size="sm">
                    <CopyButton value={query} className="mr-2" />
                    Copy
                  </Button>
                  <Button onClick={handleRunQuery} disabled={isLoading}>
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? "Running..." : "Run Query"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="query" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="query">Query</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                </TabsList>
                <TabsContent value="query" className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your GraphQL query here..."
                    className="font-mono text-sm min-h-[300px]"
                  />
                </TabsContent>
                <TabsContent value="variables" className="space-y-4">
                  <Textarea
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                    placeholder="Enter query variables as JSON..."
                    className="font-mono text-sm min-h-[300px]"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Response</CardTitle>
                {response && <CopyButton value={response} />}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Executing query...</span>
                </div>
              ) : response ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm font-mono max-h-[400px]">{response}</pre>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run a query to see the response here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schema Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Schema Overview</CardTitle>
          <CardDescription>Key types and fields available in the Yndxr GraphQL API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-3">Channel Type</h4>
              <pre className="bg-muted p-3 rounded text-sm font-mono">
                {`type Channel {
  id: String!
  name: String!
  status: ChannelStatus!
  createdAt: DateTime!
  lastActivityAt: DateTime
  totalActivities: Int!
  throughput: Float!
  metadata: JSON
  recentActivities(limit: Int): [Activity!]!
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Activity Type</h4>
              <pre className="bg-muted p-3 rounded text-sm font-mono">
                {`type Activity {
  id: String!
  channelId: String!
  type: ActivityType!
  timestamp: DateTime!
  payload: String!
  metadata: JSON
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

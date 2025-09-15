"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { SearchInput } from "@/components/ui/search-input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { Search, Activity, Database, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "channel" | "activity"
  title: string
  description: string
  metadata: Record<string, any>
  relevanceScore: number
  highlights?: string[]
}

// Mock search results
const mockResults: SearchResult[] = [
  {
    id: "ch_001",
    type: "channel",
    title: "Main Trading Channel",
    description: "Primary channel for handling trading activities and order processing on Yellow Chain",
    metadata: { status: "active", activities: 15420, throughput: 125.5 },
    relevanceScore: 0.95,
    highlights: ["trading", "order processing"],
  },
  {
    id: "act_001",
    type: "activity",
    title: "New trade executed: 1000 YELLOW tokens at $0.45",
    description: "Trading activity from Main Trading Channel",
    metadata: { channelId: "ch_001", type: "message", timestamp: "2024-01-15T10:30:00Z" },
    relevanceScore: 0.87,
    highlights: ["trade executed", "1000 YELLOW"],
  },
  {
    id: "ch_003",
    type: "channel",
    title: "NFT Marketplace",
    description: "Channel for NFT trading and marketplace activities",
    metadata: { status: "active", activities: 8765, throughput: 67.3 },
    relevanceScore: 0.82,
    highlights: ["NFT", "marketplace"],
  },
  {
    id: "act_008",
    type: "activity",
    title: "NFT sold: CryptoPunk #1234 for 50 YELLOW",
    description: "NFT trading activity from NFT Marketplace channel",
    metadata: { channelId: "ch_003", type: "message", timestamp: "2024-01-15T10:28:15Z" },
    relevanceScore: 0.78,
    highlights: ["NFT sold", "CryptoPunk"],
  },
]

const searchSuggestions = [
  "trading volume",
  "NFT marketplace",
  "governance proposals",
  "high volume alerts",
  "liquidity pools",
  "smart contracts",
]

export default function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.highlights?.some((highlight) => highlight.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setResults(filteredResults)
      setIsLoading(false)
    }, 800)
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const highlightText = (text: string, highlights: string[] = []) => {
    if (!highlights.length) return text

    let highlightedText = text
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi")
      highlightedText = highlightedText.replace(regex, '<mark class="bg-primary/20 px-1 rounded">$1</mark>')
    })

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
  }

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, handleSearch])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageHeader title="Search" description="Search across all indexed channels and activities" />

      <div className="max-w-2xl mx-auto space-y-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search channels, activities, or content..."
          className="w-full text-lg h-12"
        />

        {!hasSearched && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular searches</h3>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">1,247</div>
                    <div className="text-sm text-muted-foreground">Total Channels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">892,456</div>
                    <div className="text-sm text-muted-foreground">Total Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">24/7</div>
                    <div className="text-sm text-muted-foreground">Real-time Indexing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasSearched && !isLoading && results.length === 0 && (
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="No results found"
            description={`No results found for "${query}". Try different keywords or check your spelling.`}
            action={{
              label: "Clear search",
              onClick: () => {
                setQuery("")
                setHasSearched(false)
              },
            }}
          />
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </p>
              <div className="text-xs text-muted-foreground">Sorted by relevance</div>
            </div>

            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {result.type === "channel" ? (
                          <Database className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                        <Link
                          href={
                            result.type === "channel" ? `/channels/${result.id}` : `/activities?search=${result.id}`
                          }
                          className="hover:text-primary transition-colors"
                        >
                          {highlightText(result.title, result.highlights)}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {highlightText(result.description, result.highlights)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      <CopyButton value={result.id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.type === "channel" && (
                      <>
                        <Badge variant={result.metadata.status === "active" ? "yellow" : "secondary"}>
                          {result.metadata.status}
                        </Badge>
                        <Badge variant="outline">{result.metadata.activities?.toLocaleString()} activities</Badge>
                        {result.metadata.throughput > 0 && (
                          <Badge variant="outline">{result.metadata.throughput}/min</Badge>
                        )}
                      </>
                    )}
                    {result.type === "activity" && (
                      <>
                        <Badge
                          variant={
                            result.metadata.type === "alert"
                              ? "destructive"
                              : result.metadata.type === "update"
                                ? "yellow"
                                : "secondary"
                          }
                        >
                          {result.metadata.type}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.metadata.channelId}
                        </Badge>
                        {result.metadata.timestamp && (
                          <Badge variant="outline" className="font-mono text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(result.metadata.timestamp)}
                          </Badge>
                        )}
                      </>
                    )}
                    <Badge variant="outline" className="ml-auto">
                      {Math.round(result.relevanceScore * 100)}% match
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

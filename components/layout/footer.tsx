import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">Y</span>
            </div>
            <span className="text-sm text-muted-foreground">Yndxr - Blockchain Data Explorer</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/health" className="hover:text-foreground transition-colors">
              Status
            </Link>
            <Link href="/api-explorer" className="hover:text-foreground transition-colors">
              API Docs
            </Link>
            <a
              href="https://github.com/yellow-chain/indexer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>Built with Next.js • Powered by Yellow Chain</p>
        </div>
      </div>
    </footer>
  )
}

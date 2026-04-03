import { Link } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizErrorScreenProps {
  title: string
  message: string
  error?: Error | null
  onRetry?: () => void
  showBackButton?: boolean
}

export function QuizErrorScreen({
  title,
  message,
  error,
  onRetry,
  showBackButton = true,
}: QuizErrorScreenProps) {
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="flex items-center gap-3 text-neutral-dark">
          <CircleAlert className="size-6" />
          <div>
            <h1 className="text-2xl font-semibold text-neutral-darker">
              {title}
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-neutral-dark">
          {error instanceof Error ? error.message : message}
        </p>
        <div className="mt-6 flex gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="flex-1 bg-bright-sun-base text-neutral-darker hover:bg-yellow-500"
            >
              Coba lagi
            </Button>
          )}
          {showBackButton && (
            <Button
              asChild
              variant="outline"
              className="flex-1 border-neutral-dark text-neutral-dark"
            >
              <Link to="/">Kembali</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

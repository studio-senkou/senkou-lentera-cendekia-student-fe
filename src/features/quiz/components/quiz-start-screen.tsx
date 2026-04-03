import { Link } from '@tanstack/react-router'
import { Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizStartScreenProps {
  title: string
  onStart: () => void
  isLoading: boolean
  hasAttempt: boolean
}

export function QuizStartScreen({
  title,
  onStart,
  isLoading,
  hasAttempt,
}: QuizStartScreenProps) {
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <h1 className="mb-4 text-center text-2xl font-semibold text-neutral-darker">
          {title || 'Quiz'}
        </h1>
        <p className="mb-8 text-center text-neutral-dark">
          Siap mengerjakan kuis? Soal akan ditampilkan satu per satu.
        </p>

        <Button
          onClick={onStart}
          disabled={isLoading}
          className="w-full bg-bright-sun-base text-neutral-darker hover:bg-yellow-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <Play className="size-4" />
              {hasAttempt ? 'Lanjutkan kuis' : 'Mulai kuis'}
            </>
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          className="mt-3 w-full border-neutral-dark text-neutral-dark hover:bg-neutral-lighter"
        >
          <Link to="/">Kembali</Link>
        </Button>
      </div>
    </div>
  )
}

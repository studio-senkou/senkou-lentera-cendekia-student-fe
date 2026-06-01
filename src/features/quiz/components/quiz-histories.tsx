import { useRef } from 'react'
import { Calendar, Clock, TrendingUp } from 'lucide-react'
import type { QuizHistory } from '@/lib/quiz'
import { cn } from '@/lib/utils'

interface QuizHistoriesProps {
  histories: Array<QuizHistory>
}

export function QuizHistories({ histories }: QuizHistoriesProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 'prev' | 'next') => {
    const container = listRef.current

    if (!container) {
      return
    }

    const card = container.querySelector<HTMLElement>('[data-quiz-history-card]')
    const cardWidth = card?.offsetWidth ?? container.clientWidth
    const gap = 12
    const amount = direction === 'prev' ? -(cardWidth + gap) : cardWidth + gap

    container.scrollBy({
      left: amount,
      behavior: 'smooth',
    })
  }

  if (histories.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-lighter bg-neutral-lighter/50 p-6 text-center">
        <p className="text-neutral-dark">Belum ada riwayat kuis</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        ref={listRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {histories.map((history) => (
          <div
            key={history.id}
            data-quiz-history-card
            className="min-w-full rounded-lg border border-neutral-lighter bg-white p-4 transition-colors hover:border-neutral-dark sm:min-w-[calc(50%-0.375rem)] lg:min-w-[calc(50%-0.375rem)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded px-2 py-1 text-xs font-semibold uppercase',
                      history.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : history.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-lighter text-neutral-dark',
                    )}
                  >
                    {history.status === 'completed'
                      ? 'Selesai'
                      : history.status === 'in_progress'
                        ? 'Dalam Proses'
                        : 'Draft'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-dark">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(history.started_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>
                      {new Date(history.started_at).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-bright-sun-base" />
                  <span className="text-2xl font-bold text-neutral-darker">
                    {history.score.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-neutral-dark">Nilai</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => scrollByCard('prev')}
          className="flex items-center justify-center rounded-full p-2 text-neutral-darker hover:bg-neutral-lighter"
          aria-label="Riwayat sebelumnya"
        >
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          <span className="size-2 rounded-full bg-bright-sun-base" />
          <span className="size-2 rounded-full bg-neutral-lighter" />
          <span className="size-2 rounded-full bg-neutral-lighter" />
        </div>

        <button
          type="button"
          onClick={() => scrollByCard('next')}
          className="flex items-center justify-center rounded-full p-2 text-neutral-darker hover:bg-neutral-lighter"
          aria-label="Riwayat berikutnya"
        >
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

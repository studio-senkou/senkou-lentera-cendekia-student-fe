import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface QuizCompletedScreenProps {
  score: number | null
  totalScore: number
}

export function QuizCompletedScreen({
  score,
  totalScore,
}: QuizCompletedScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center">
        {/* Decorative stars background */}
        <div className="relative mb-8 h-64 w-64">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Circle badge background */}
            <div className="absolute h-56 w-56 rounded-full bg-gradient-to-b from-bright-sun-lightest to-bright-sun-lighter" />

            {/* Celebration icon */}
            <div className="relative z-10 text-6xl">🎉</div>
          </div>

          {/* Decorative stars */}
          <div className="absolute left-4 top-4 text-2xl text-bright-sun-base">
            ⭐
          </div>
          <div className="absolute right-3 top-6 text-xl text-bright-sun-lighter">
            ✨
          </div>
          <div className="absolute left-8 bottom-12 text-2xl text-bright-sun-base">
            ⭐
          </div>
          <div className="absolute right-6 bottom-8 text-xl text-bright-sun-base">
            🎊
          </div>
          <div className="absolute left-0 top-1/2 text-lg text-bright-sun-lighter">
            ⭐
          </div>
          <div className="absolute right-0 top-1/3 text-xl text-bright-sun-base">
            ✨
          </div>
        </div>

        {/* Score section */}
        <p className="mb-2 text-center text-sm font-medium text-neutral-dark">
          Skor Anda
        </p>
        <p className="mb-4 text-center text-5xl font-bold text-neutral-darker">
          {score ?? '-'}
          <span className="text-2xl text-neutral-dark">/{totalScore}</span>
        </p>

        {/* Congratulations */}
        <h1 className="mb-2 text-center text-2xl font-bold text-neutral-darker">
          Selamat! 🎉
        </h1>
        <p className="mb-6 text-center text-neutral-dark">
          Kerja bagus! Kamu telah berhasil menyelesaikan kuis.
        </p>

        {/* Points */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-bright-sun-lightest px-4 py-2">
          <span className="text-lg">⭐</span>
          <span className="font-semibold text-neutral-darker">
            {score ? score * 10 : '-'} Poin
          </span>
        </div>

        {/* Back button */}
        <Button
          asChild
          className="w-full bg-neutral-darker text-white hover:bg-black"
        >
          <Link to="/">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

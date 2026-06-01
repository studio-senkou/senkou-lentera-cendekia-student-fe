import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const QuizShortcut = () => {
  const [quizId, setQuizId] = useState('')

  const trimmedQuizId = quizId.trim()

  return (
    <div className="rounded-2xl border border-neutral-lighter bg-gradient-to-br from-bright-sun-lightest via-white to-downy-lightest p-5 shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-8">
        <div className="max-w-xl">
          <h2 className="mt-2 text-2xl font-semibold text-neutral-darker">
            Punya kode kuis?
          </h2>
          <p className="mt-2 text-sm text-neutral-dark">
            Masukkan kode kuis untuk mengakses kuis yang diberikan oleh guru
            kamu. Pastikan kode yang kamu masukkan benar dan sesuai dengan yang
            diberikan oleh guru kamu.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-80">
          <Input
            type="text"
            maxLength={8}
            placeholder="Masukkan kode kuis"
            value={quizId}
            onChange={(event) => setQuizId(event.target.value.toUpperCase())}
            className="bg-white"
          />
          <Button
            asChild
            disabled={trimmedQuizId.length !== 8}
            className="w-full md:w-auto"
          >
            <Link to="/quiz/code/$code" params={{ code: trimmedQuizId }}>
              <Play className="size-4" />
              Buka kuis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

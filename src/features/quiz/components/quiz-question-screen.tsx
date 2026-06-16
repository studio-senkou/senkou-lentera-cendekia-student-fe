import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import type { QuizNavigation, QuizQuestion } from '@/lib/quiz'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getFileUrl } from '@/utils/asset'

interface QuizQuestionScreenProps {
  title: string
  currentQuestion: QuizQuestion
  selectedOptionId?: number
  navigation: QuizNavigation | undefined
  currentIndex: number
  totalQuestions: number
  currentProgress: number
  isNextLoading: boolean
  isPreviousLoading: boolean
  isSubmitting: boolean
  onSelectOption: (questionId: number, optionId: number) => void
  onNextQuestion: () => Promise<void>
  onPreviousQuestion: () => Promise<void>
  onBack: () => void
  deadline?: Date
  onTimeUp?: () => void
}

export function QuizQuestionScreen({
  title,
  currentQuestion,
  selectedOptionId,
  navigation,
  currentIndex,
  totalQuestions,
  currentProgress,
  isNextLoading,
  isPreviousLoading,
  isSubmitting,
  onSelectOption,
  onNextQuestion,
  onPreviousQuestion,
  onBack,
  deadline,
  onTimeUp,
}: QuizQuestionScreenProps) {
  const answerOptions = currentQuestion.options

  const [timeLeftStr, setTimeLeftStr] = useState<string>('--:--')

  useEffect(() => {
    if (!deadline) {
      setTimeLeftStr('--:--')
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const diff = deadline.getTime() - now

      if (diff <= 0) {
        setTimeLeftStr('00:00')
        return 0
      }

      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      const mm = String(minutes).padStart(2, '0')
      const ss = String(seconds).padStart(2, '0')
      setTimeLeftStr(`${mm}:${ss}`)
      return diff
    }

    const initialDiff = calculateTimeLeft()
    if (initialDiff <= 0) {
      onTimeUp?.()
      return
    }

    const interval = setInterval(() => {
      const diff = calculateTimeLeft()
      if (diff <= 0) {
        clearInterval(interval)
        onTimeUp?.()
      }
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full p-2 hover:bg-neutral-lighter"
          >
            <ArrowLeft className="size-5 text-neutral-darker" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-neutral-darker">
            {title}
          </h1>
          <div className="flex items-center justify-center rounded-full bg-bright-sun-base px-3 py-2 text-sm font-semibold text-neutral-darker">
            {timeLeftStr}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-neutral-lighter">
          <div
            className="h-full bg-bright-sun-base transition-all"
            style={{ width: `${Math.min(currentProgress, 100)}%` }}
          />
        </div>

        {/* Question counter */}
        <p className="mb-4 text-center text-sm font-medium text-neutral-dark">
          Question {currentIndex + 1} of {totalQuestions || '-'}
        </p>

        {/* Question text */}
        <h2 className="mb-6 text-center text-xl font-semibold leading-snug text-neutral-darker">
          {currentQuestion.question_text}
        </h2>

        {/* Question Image */}
        {currentQuestion.image_url && (
          <div className="mb-6 flex justify-center">
            <img
              src={getFileUrl(currentQuestion.image_url)}
              alt="Question"
              className="max-h-64 w-full rounded-xl object-contain"
            />
          </div>
        )}

        {/* Options */}
        <div className="mb-8 flex flex-col gap-3">
          {answerOptions.map((option) => {
            const isSelected = selectedOptionId === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(currentQuestion.id, option.id)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all',
                  isSelected
                    ? 'border-bright-sun-base bg-bright-sun-lighter text-white'
                    : 'border-neutral-lighter bg-white hover:border-neutral-dark',
                )}
              >
                <div
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border-2 font-semibold',
                    isSelected
                      ? 'border-white bg-white text-neutral-darker'
                      : 'border-neutral-lighter bg-white text-neutral-darker',
                  )}
                >
                  {isSelected && <Check className="size-4" />}
                </div>
                <span className="text-sm font-medium text-neutral-darker">
                  {option.option_text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Navigation buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={onPreviousQuestion}
            disabled={
              !navigation?.has_prev || isPreviousLoading || isSubmitting
            }
            variant="outline"
            className="w-full border-neutral-dark text-neutral-dark hover:bg-neutral-lighter"
          >
            {isPreviousLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
              </>
            ) : (
              <>Kembali</>
            )}
          </Button>
          <Button
            onClick={onNextQuestion}
            disabled={isNextLoading || isSubmitting}
            variant={'default'}
            className="w-full"
          >
            {navigation?.has_next ? (
              isNextLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  Next <ArrowRight className="size-4" />
                </>
              )
            ) : isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting
              </>
            ) : (
              <>
                Submit <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

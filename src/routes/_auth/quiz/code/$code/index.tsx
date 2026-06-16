import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import type {
  QuizAnswerPayload,
  QuizInfo,
  QuizQuestionPayload,
  QuizStatusPayload,
  QuizSubmitPayload,
} from '@/lib/quiz'
import {
  getCurrentQuizQuestion,
  getNextQuizQuestion,
  getPreviousQuizQuestion,
  getQuizByCode,
  getQuizStatus,
  submitQuizAnswers,
} from '@/lib/quiz'
import { QuizCompletedScreen } from '@/features/quiz/components/quiz-completed-screen'
import { QuizErrorScreen } from '@/features/quiz/components/quiz-error-screen'
import { QuizLoadingScreen } from '@/features/quiz/components/quiz-loading-screen'
import { QuizQuestionScreen } from '@/features/quiz/components/quiz-question-screen'
import { QuizStartScreen } from '@/features/quiz/components/quiz-start-screen'

export const Route = createFileRoute('/_auth/quiz/code/$code/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { code } = useParams({ from: '/_auth/quiz/code/$code/' })
  const queryClient = useQueryClient()
  const [quizStarted, setQuizStarted] = useState(false)
  const [submitResult, setSubmitResult] = useState<QuizSubmitPayload | null>(
    null,
  )
  const [answersByQuestionId, setAnswersByQuestionId] = useState<
    Record<number, number>
  >({})

  const quizQuery = useQuery<QuizInfo>({
    queryKey: ['quiz', code],
    queryFn: () => getQuizByCode(code),
    staleTime: 1000 * 60 * 5,
  })

  const quizId = quizQuery.data?.id

  const statusQuery = useQuery<QuizStatusPayload>({
    queryKey: ['quiz', quizId, 'status'],
    queryFn: () => getQuizStatus(quizId!),
    enabled: !!quizId,
    staleTime: 1000 * 30,
  })

  const isCompleted =
    submitResult || statusQuery.data?.attempt?.status === 'completed'

  useEffect(() => {
    if (
      statusQuery.data?.has_attempt &&
      statusQuery.data.attempt?.status === 'in_progress'
    ) {
      setQuizStarted(true)
    }
  }, [statusQuery.data])

  const currentQuestionQuery = useQuery<QuizQuestionPayload>({
    queryKey: ['quiz', quizId, 'current'],
    queryFn: () => getCurrentQuizQuestion(quizId!),
    enabled: quizStarted && !isCompleted && !!quizId,
    staleTime: 0,
  })

  const nextQuestionMutation = useMutation({
    mutationFn: () => getNextQuizQuestion(quizId!),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['quiz', quizId, 'current'],
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to move to the next question',
      )
    },
  })

  const previousQuestionMutation = useMutation({
    mutationFn: () => getPreviousQuizQuestion(quizId!),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['quiz', quizId, 'current'],
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to move to the previous question',
      )
    },
  })

  const submitMutation = useMutation({
    mutationFn: (answers: Array<QuizAnswerPayload>) =>
      submitQuizAnswers(quizId!, answers),
    onSuccess: (data) => {
      setSubmitResult(data)
      setQuizStarted(true)
      toast.success('Quiz submitted successfully')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit quiz',
      )
    },
  })

  const currentQuestion = currentQuestionQuery.data?.question
  const navigation = currentQuestionQuery.data?.navigation

  const selectedOptionId = currentQuestion
    ? answersByQuestionId[currentQuestion.id]
    : undefined

  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswersByQuestionId((current) => ({
      ...current,
      [questionId]: optionId,
    }))
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleNextQuestion = async () => {
    if (navigation?.has_next) {
      await nextQuestionMutation.mutateAsync()
      return
    }

    const answers = Object.entries(answersByQuestionId).map(
      ([questionId, optionId]) => ({
        question_id: Number(questionId),
        option_id: optionId,
      }),
    )

    if (answers.length === 0) {
      toast.error('Pilih minimal satu jawaban sebelum submit')
      return
    }

    await submitMutation.mutateAsync(answers)
  }

  const handlePreviousQuestion = async () => {
    await previousQuestionMutation.mutateAsync()
  }

  // Quiz loading
  if (quizQuery.isLoading) {
    return <QuizLoadingScreen />
  }

  // Quiz not found
  if (quizQuery.isError) {
    return (
      <QuizErrorScreen
        title="Kode kuis tidak ditemukan"
        message={
          quizQuery.error instanceof Error
            ? quizQuery.error.message
            : 'Kode kuis tidak valid atau tidak tersedia.'
        }
        error={quizQuery.error}
        onRetry={() => quizQuery.refetch()}
        showBackButton
      />
    )
  }

  // Status loading
  if (statusQuery.isLoading) {
    return <QuizLoadingScreen />
  }

  // Status error
  if (statusQuery.isError) {
    return (
      <QuizErrorScreen
        title="Gagal memuat status kuis"
        message={
          statusQuery.error instanceof Error
            ? statusQuery.error.message
            : 'Coba ulangi pemuatan atau kembali beberapa saat lagi.'
        }
        error={statusQuery.error}
        onRetry={() => statusQuery.refetch()}
        showBackButton={false}
      />
    )
  }

  // Quiz completed
  if (isCompleted) {
    return (
      <QuizCompletedScreen
        score={submitResult?.score ?? statusQuery.data?.attempt?.score ?? 0}
        totalScore={100}
      />
    )
  }

  // Quiz not started
  if (!quizStarted) {
    return (
      <QuizStartScreen
        title={quizQuery.data?.title || 'Quiz'}
        onStart={handleStartQuiz}
        isLoading={statusQuery.isFetching}
        hasAttempt={statusQuery.data?.has_attempt ?? false}
      />
    )
  }

  // Loading current question
  if (currentQuestionQuery.isLoading || !currentQuestion) {
    return <QuizLoadingScreen />
  }

  // Error loading question
  if (currentQuestionQuery.isError) {
    return (
      <QuizErrorScreen
        title="Soal tidak bisa dimuat"
        message={
          currentQuestionQuery.error instanceof Error
            ? currentQuestionQuery.error.message
            : 'Coba ulangi pemuatan soal.'
        }
        error={currentQuestionQuery.error}
        onRetry={() => currentQuestionQuery.refetch()}
        showBackButton
      />
    )
  }

  const totalQuestions = navigation?.total_questions ?? 0
  const currentIndex = navigation?.current_index ?? 0
  const currentProgress = totalQuestions
    ? ((currentIndex + 1) / totalQuestions) * 100
    : 0

  const deadline =
    statusQuery.data?.attempt?.started_at && quizQuery.data?.duration_minutes
      ? new Date(
          new Date(statusQuery.data.attempt.started_at).getTime() +
            quizQuery.data.duration_minutes * 60 * 1000,
        )
      : undefined

  const handleTimeUp = async () => {
    if (submitMutation.isPending || isCompleted) return

    toast.info('Waktu habis! Kuis otomatis disubmit.')

    const answers = Object.entries(answersByQuestionId).map(
      ([questionId, optionId]) => ({
        question_id: Number(questionId),
        option_id: optionId,
      }),
    )

    await submitMutation.mutateAsync(answers)
  }

  return (
    <QuizQuestionScreen
      title={quizQuery.data?.title || 'Quiz'}
      currentQuestion={currentQuestion}
      selectedOptionId={selectedOptionId}
      navigation={navigation}
      currentIndex={currentIndex}
      totalQuestions={totalQuestions}
      currentProgress={currentProgress}
      isNextLoading={nextQuestionMutation.isPending || submitMutation.isPending}
      isPreviousLoading={previousQuestionMutation.isPending}
      isSubmitting={submitMutation.isPending}
      onSelectOption={handleSelectOption}
      onNextQuestion={handleNextQuestion}
      onPreviousQuestion={handlePreviousQuestion}
      onBack={() => setQuizStarted(false)}
      deadline={deadline}
      onTimeUp={handleTimeUp}
    />
  )
}

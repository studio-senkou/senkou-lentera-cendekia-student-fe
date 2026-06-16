import { http } from './api'

export interface QuizOption {
  id: number
  option_text: string
}

export interface QuizQuestion {
  id: number
  image_url?: string
  question_text: string
  options: Array<QuizOption>
}

export interface QuizNavigation {
  current_index: number
  total_questions: number
  has_prev: boolean
  has_next: boolean
}

export interface QuizQuestionPayload {
  navigation: QuizNavigation
  question: QuizQuestion
}

export interface QuizAttemptStatus {
  id: number
  status: string
  score: number | null
  started_at: string
  submitted_at: string | null
}

export interface QuizStatusPayload {
  has_attempt: boolean
  attempt: QuizAttemptStatus | null
}

export interface QuizAnswerPayload {
  question_id: number
  option_id: number
}

export interface QuizSubmitPayload {
  attempt_id: number
  score: number
  passing_score: number
  passed: boolean
  submitted_at: string
}

export interface QuizInfo {
  id: number
  code: string
  title?: string
}

export interface QuizHistory {
  id: number
  quiz_id: number
  status: string
  score: number
  started_at: string
  submitted_at: string
}

export interface QuizHistoriesPayload {
  histories: Array<QuizHistory>
  total: number
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

async function fetchQuizQuestionDataWithGet(
  endpoint: string,
  fallbackMessage: string,
): Promise<QuizQuestionPayload> {
  try {
    const response = await http.get(endpoint)

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data as QuizQuestionPayload
    }

    throw new Error(response.data?.message || fallbackMessage)
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage))
  }
}

async function fetchQuizQuestionDataWithPost(
  endpoint: string,
  fallbackMessage: string,
): Promise<QuizQuestionPayload> {
  try {
    const response = await http.post(endpoint)

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data as QuizQuestionPayload
    }

    throw new Error(response.data?.message || fallbackMessage)
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage))
  }
}

export async function getQuizByCode(code: string) {
  try {
    const response = await http.get(`/quiz/code/${code}`)

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data.quiz as QuizInfo
    }

    throw new Error(response.data?.message || 'Failed to fetch quiz')
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch quiz'))
  }
}

export async function getQuizStatus(quizId: number) {
  try {
    const response = await http.get(`/quiz/${quizId}/status`)

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data as QuizStatusPayload
    }

    throw new Error(response.data?.message || 'Failed to fetch quiz status')
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch quiz status'))
  }
}

export async function getCurrentQuizQuestion(quizId: number) {
  return fetchQuizQuestionDataWithGet(
    `/quiz/${quizId}/questions/current`,
    'Failed to fetch current quiz question',
  )
}

export async function getNextQuizQuestion(quizId: number) {
  return fetchQuizQuestionDataWithPost(
    `/quiz/${quizId}/questions/next`,
    'Failed to fetch next quiz question',
  )
}

export async function getPreviousQuizQuestion(quizId: number) {
  return fetchQuizQuestionDataWithPost(
    `/quiz/${quizId}/questions/prev`,
    'Failed to fetch previous quiz question',
  )
}

export async function submitQuizAnswers(
  quizId: number,
  answers: Array<QuizAnswerPayload>,
) {
  try {
    const response = await http.post(`/quiz/${quizId}/submit`, {
      answers,
    })

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data as QuizSubmitPayload
    }

    throw new Error(response.data?.message || 'Failed to submit quiz')
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to submit quiz'))
  }
}

export async function getQuizHistories() {
  try {
    const response = await http.get('/quiz/histories')

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data as QuizHistoriesPayload
    }

    throw new Error(response.data?.message || 'Failed to fetch quiz histories')
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch quiz histories'))
  }
}

export interface MeetingSession {
  id: number
  user_id: number
  mentor_id: number
  session_date: string
  session_time: string
  session_duration: number // Duration in minutes
  session_type: string
  session_topic: string
  session_description?: string | null
  session_proof?: string | null
  session_feedback?: string | null
  student_attendance_proof?: string | null
  mentor_attendance_proof?: string | null
  session_status: string // scheduled, completed, cancelled
  is_student_attended: boolean
  is_mentor_attended: boolean
  created_at: string
  updated_at: string
}

export interface QuizOption {
  id: number
  option_text: string
}

export interface QuizQuestion {
  id: number
  question_text: string
  options: Array<QuizOption>
}

export interface QuizNavigation {
  current_index: number
  total_questions: number
  has_prev: boolean
  has_next: boolean
}

export interface QuizQuestionResponse {
  navigation: QuizNavigation
  question: QuizQuestion
}

export interface QuizAttempt {
  id: number
  status: string
  score: number | null
  started_at: string
  submitted_at: string | null
}

export interface QuizStatusResponse {
  has_attempt: boolean
  attempt: QuizAttempt | null
}

export interface QuizSubmitAnswer {
  question_id: number
  option_id: number
}

export interface QuizSubmitResponse {
  attempt_id: number
  score: number
  passing_score: number
  passed: boolean
  submitted_at: string
}

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

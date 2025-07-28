import { http } from './api'

export const getMeetingSession = async () => {
  try {
    const response = await http.get('/meeting-sessions/me')
    return response.data.data.sessions
  } catch (error) {
    return []
  }
}

export const getMeetingSessionById = async (id: string) => {
  try {
    const response = await http.get(`/meeting-sessions/${id}`)
    return response.data.data.session
  } catch (error) {
    return null
  }
}

interface StudentMeetingAttendance {
  session_proof: File | null
  signature: File | null
}

export const attendMeetingSessionAsStudent = async (
  id: number,
  { session_proof, signature }: StudentMeetingAttendance,
) => {
  const formData = new FormData()
  if (session_proof) {
    formData.append('session_proof', session_proof)
  }
  if (signature) {
    formData.append('session_attendance_proof', signature)
  }

  try {
    const response = await http.post(
      `/meeting-sessions/${id}/student-attend`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.data
  } catch (error) {
    throw new Error('Failed to attend meeting session')
  }
}

interface MentorMeetingAttendance {
  session_proof: File | null
  session_feedback?: string
}

export const attendMeetingSessionAsMentor = async (
  id: number,
  { session_proof, session_feedback }: MentorMeetingAttendance,
) => {
  const formData = new FormData()
  if (session_proof) {
    formData.append('session_attendance_proof', session_proof)
  }
  if (session_feedback) {
    formData.append('session_feedback', session_feedback)
  }

  try {
    const response = await http.post(
      `/meeting-sessions/${id}/mentor-attend`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.data
  } catch (error) {
    throw new Error('Failed to attend meeting session')
  }
}

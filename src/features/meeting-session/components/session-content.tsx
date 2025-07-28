import { Skeleton } from '@/components/ui/skeleton'
import { ImageWithSkeleton } from '@/components/image'
import {
  MeetingSessionForm,
  MentorMeetingSessionForm,
} from '@/components/form/meeting-session-form'
import { getImageUrl } from '@/utils/asset'
import type { MeetingSession } from '@/types'

interface SessionContentProps {
  session?: MeetingSession
  isLoading: boolean
  activeRole?: string | null
}

export function SessionContent({
  session,
  isLoading,
  activeRole,
}: SessionContentProps) {
  const getTitle = () => {
    if (isLoading) return <Skeleton className="h-8 w-1/3" />

    if (session?.is_student_attended || session?.is_mentor_attended) {
      return 'Bukti Kehadiran'
    }

    return 'Form Kehadiran'
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mt-5 space-y-8">
          <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-64 w-96 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-64 w-96 rounded-lg" />
          </div>
        </div>
      )
    }

    if (activeRole === 'user' && session?.is_student_attended) {
      return (
        <div>
          <h2 className="mt-5 font-semibold">Bukti Sesi</h2>
          <ImageWithSkeleton
            src={getImageUrl(session?.session_proof!)}
            alt="Bukti Kehadiran"
            className="w-96 h-auto rounded-lg mt-4"
          />

          <h2 className="mt-5 font-semibold">Tanda Tangan</h2>
          <ImageWithSkeleton
            src={getImageUrl(session?.student_attendance_proof!)}
            alt="Bukti Tanda Tangan"
            className="w-96 h-auto rounded-lg mt-4"
          />

          {session?.session_feedback && (
            <>
              <h2 className="mt-5 font-semibold">Feedback dari Mentor</h2>
              <p className="bg-neutral-lightest p-4 rounded-lg mt-2">
                <q>{session.session_feedback}</q>
              </p>
            </>
          )}
        </div>
      )
    }

    if (activeRole === 'mentor' && session?.is_mentor_attended) {
      return (
        <>
          <h2 className="mt-5 font-semibold">Bukti Sesi</h2>
          <ImageWithSkeleton
            src={getImageUrl(session?.mentor_attendance_proof!)}
            alt="Bukti Kehadiran"
            className="w-96 h-auto rounded-lg mt-4"
          />

          {session?.session_feedback && (
            <>
              <h2 className="mt-5 font-semibold">Feedback Sesi</h2>
              <p className="bg-neutral-lightest p-4 rounded-lg mt-2">
                <q>{session.session_feedback}</q>
              </p>
            </>
          )}
        </>
      )
    }

    if (activeRole === 'user') {
      return <MeetingSessionForm sessionId={session?.id!} className="mt-5" />
    } else {
      return (
        <MentorMeetingSessionForm sessionId={session?.id!} className="mt-5" />
      )
    }
  }

  return (
    <div className="mt-12">
      <h1 className="text-2xl font-semibold">{getTitle()}</h1>
      {renderContent()}
    </div>
  )
}

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Timer } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useSession } from '@/stores/use-session'

export interface MeetingSessionCardProps {
  id: number
  session_topic: string
  session_description?: string | null
  session_date: string
  session_time: string
  session_duration: number
  is_student_attended: boolean
  is_mentor_attended: boolean
}

export const MeetingSessionCard = ({
  id: session_id,
  session_topic,
  session_description,
  session_date,
  session_time,
  session_duration,
  is_student_attended,
  is_mentor_attended,
}: MeetingSessionCardProps) => {
  const navigate = useNavigate({
    from: '/',
  })

  const activeRole = useSession((state) => state.activeRole)

  return (
    <div className="border border-neutral-base p-4 rounded-lg !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-medium">{session_topic}</h2>
      {session_description && (
        <p className="text-md text-neutral-darker mt-2">
          {session_description}
        </p>
      )}
      <div className="space-y-2 text-sm mt-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Tanggal:</span>
          {format(new Date(session_date), 'MMMM dd, yyyy', {
            locale: id,
          })}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Waktu:</span>
          <span>{format(new Date(session_time), 'HH:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Durasi:</span>
          <span>{session_duration} Menit</span>
        </div>
      </div>
      <div className="min-w-full flex justify-end mt-4">
        <Button
          shadow={false}
          onClick={() =>
            navigate({
              to: '/sessions/$id',
              params: { id: session_id.toString() },
            })
          }
        >
          {activeRole === 'user' && is_student_attended
            ? 'Lihat Bukti Kehadiran'
            : activeRole === 'mentor' && is_mentor_attended
              ? 'Lihat Kehadiran Mentor'
              : 'Isi Kehadiran'}
        </Button>
      </div>
    </div>
  )
}

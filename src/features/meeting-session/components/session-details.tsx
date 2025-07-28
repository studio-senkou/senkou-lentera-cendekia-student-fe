import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar, Clock, Timer } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { MeetingSession } from '@/types'

interface SessionDetailsProps {
  session?: MeetingSession
  isLoading: boolean
}

export function SessionDetails({ session, isLoading }: SessionDetailsProps) {
  if (isLoading) {
    return (
      <div className="border border-neutral-light shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 mt-4">
        <div className="mb-2">
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2 text-sm mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-neutral-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 mt-4">
      <h2 className="text-2xl font-medium">{session?.session_topic}</h2>
      {session?.session_description && (
        <p className="text-md text-neutral-darker mt-2">
          {session?.session_description}
        </p>
      )}
      <div className="space-y-2 text-sm mt-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Tanggal:</span>
          {session?.session_date ? (
            format(new Date(session.session_date), 'MMMM dd, yyyy', {
              locale: localeId,
            })
          ) : (
            <span>-</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Waktu:</span>
          {session?.session_time ? (
            <span>{format(new Date(session.session_time), 'HH:mm a')}</span>
          ) : (
            <span>-</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Durasi:</span>
          <span>{session?.session_duration} Menit</span>
        </div>
      </div>
    </div>
  )
}

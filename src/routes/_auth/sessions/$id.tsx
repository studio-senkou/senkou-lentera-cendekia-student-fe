import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getMeetingSessionById } from '@/lib/meeting-session'
import type { MeetingSession } from '@/types'
import { useSession } from '@/stores/use-session'
import { SessionHeader } from '@/features/meeting-session/components/session-header'
import { SessionDetails } from '@/features/meeting-session/components/session-details'
import { SessionContent } from '@/features/meeting-session/components/session-content'

export const Route = createFileRoute('/_auth/sessions/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({
    from: '/_auth/sessions/$id',
  })

  const activeRole = useSession((state) => state.activeRole)

  const { data: session, isLoading } = useQuery<MeetingSession>({
    queryKey: ['sessions', id],
    queryFn: () => getMeetingSessionById(id),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="max-w-3xl mx-auto">
      <SessionHeader />

      <div className="p-4">
        <h1 className="text-2xl font-semibold">Detail Pertemuan</h1>

        <SessionDetails session={session} isLoading={isLoading} />

        <SessionContent
          session={session}
          isLoading={isLoading}
          activeRole={activeRole}
        />
      </div>
    </div>
  )
}

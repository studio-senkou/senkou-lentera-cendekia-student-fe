import { getDetailUser } from '@/lib/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import userProfileImage from '@/assets/images/user-profile.jpg'
import { getMeetingSession } from '@/lib/meeting-session'
import { MeetingSessionCard } from '@/features/meeting-session/components/session-card'
import type { MeetingSession } from '@/types'
import { Button } from '@/components/ui/button'
import { DoorOpen } from 'lucide-react'
import { useSession } from '@/stores/use-session'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
})

function SkeletonUser() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-14 h-14 rounded-full" />
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  )
}

function SkeletonSessionCard() {
  return <Skeleton className="h-24 rounded-lg" />
}

function RouteComponent() {
  const { data: userDetail, isLoading: loadingUserDetail } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getDetailUser,
    staleTime: 1000 * 60 * 5,
  })

  const { data: meetingSessions, isLoading: loadingMeetingSessions } = useQuery(
    {
      queryKey: ['users', 'sessions'],
      queryFn: getMeetingSession,
      staleTime: 1000 * 60 * 5,
    },
  )

  const logout = useSession((state) => state.logout)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        {loadingUserDetail ? (
          <SkeletonUser />
        ) : (
          <div className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img src={userProfileImage} alt="Profile Picture" />
            </div>
            <div>
              <p className="text-sm">Welcome</p>
              <h3 className="text-lg font-medium">
                {userDetail?.name || 'User'}
              </h3>
            </div>
          </div>
        )}
        <div className="p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={logout}
            className="rounded-sm"
          >
            <DoorOpen />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {loadingMeetingSessions ? (
          <>
            <SkeletonSessionCard />
            <SkeletonSessionCard />
          </>
        ) : (
          <>
            {meetingSessions?.length > 0 &&
              meetingSessions?.map((session: MeetingSession) => (
                <MeetingSessionCard key={session.id} {...session} />
              ))}

            {meetingSessions?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 bg-neutral-lighter rounded-lg">
                <p className="text-md text-neutral-darker">
                  No meeting sessions available.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

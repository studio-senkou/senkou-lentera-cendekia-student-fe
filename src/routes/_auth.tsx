import { useSession } from '@/stores/use-session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  loader: async () => {
    const { accessToken, refreshToken } = useSession.getState()

    if (!accessToken || !refreshToken) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

import { useSession } from '@/stores/use-session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

export const Route = createFileRoute('/_uauth')({
  validateSearch: z.object({
    token: z.string().min(1, 'Token is required').optional(),
  }),
  onCatch: (error) => {
    toast.error(`Error: ${error.message}`)
    throw redirect({ to: '/login', replace: true })
  },
  loader: async ({ location }) => {
    const { token } = location.search as {
      token?: string
    }

    if (token) {
      throw redirect({
        to: '/register',
        search: { token },
        replace: true,
      })
    }

    const { accessToken, refreshToken } = useSession.getState()

    if (accessToken && refreshToken) {
      throw redirect({
        to: '/',
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

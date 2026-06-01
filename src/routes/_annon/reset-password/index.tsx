import { ResetPasswordForm } from '@/components/form/reset-password-form'
import { verifyOneTimeToken } from '@/lib/auth'
import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/_annon/reset-password/')({
  validateSearch: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  onCatch: () => {
    throw redirect({ to: '/login', replace: true })
  },
  loader: async ({ location }) => {
    const { token } = location.search as {
      token?: string
    }

    if (token) {
      const isValidToken = await verifyOneTimeToken(token)

      if (!isValidToken) {
        throw redirect({ to: '/login', replace: true })
      }
    } else {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({
    from: '/_annon/reset-password/',
  })

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={search.token} />
      </div>
    </div>
  )
}

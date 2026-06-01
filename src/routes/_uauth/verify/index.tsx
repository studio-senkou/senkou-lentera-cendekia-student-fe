import { VerifyForm } from '@/components/form/verify-form'
import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

export const Route = createFileRoute('/_uauth/verify/')({
  validateSearch: z.object({
    email: z.string().email('Invalid email address'),
  }),
  onCatch: (error) => {
    toast.error(`Error: ${error.message}`)
    throw redirect({ to: '/login', replace: true })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({
    from: '/_uauth/verify/',
  })

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyForm email={search.email} />
      </div>
    </div>
  )
}

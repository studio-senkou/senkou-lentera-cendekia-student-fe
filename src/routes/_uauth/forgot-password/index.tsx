import { ForgotPasswordForm } from '@/components/form/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_uauth/forgot-password/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

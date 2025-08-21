import { LoginForm } from '@/components/form/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_uauth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md mx-auto flex justify-center items-center">
        <LoginForm className="p-4 sm:p-6 md:p-8 w-full" />
      </div>
    </div>
  )
}

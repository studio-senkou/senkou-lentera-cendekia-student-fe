import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/use-form'
import { verifyAccountByEmail } from '@/lib/auth'
import z from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { requestResetPassword } from '@/lib/user'
import { useState } from 'react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      const isVerified = await verifyAccountByEmail(value.email)

      if (!isVerified) toast.error('This email is not registered as User.')

      const isResetLinkSent = await requestResetPassword(value.email)

      if (!isResetLinkSent) toast.error('Failed to send reset password link.')

      form.reset()
      setIsSubmitting(false)
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(e)
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                <img
                  src="learn-ilustration.png"
                  alt="Lentera Cendekia"
                  className="rounded-md w-auto max-w-[450px] h-auto object-contain"
                />
              </div>
              <span className="sr-only">Lentera Cendekia</span>
            </a>
            <h1 className="text-3xl font-medium">Portal Lentera Cendekia</h1>
            <div className="text-center text-md">
              Please enter your email to reset your password.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <form.AppField name="email">
                {({ TextField }) => (
                  <TextField
                    label="Email"
                    type="email"
                    autoFocus
                    autoComplete="email"
                    placeholder="m@example.com"
                  />
                )}
              </form.AppField>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
              Send Reset Link
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By proceeding, you acknowledge that you have read and agree to our{' '}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

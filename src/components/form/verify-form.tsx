import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/use-form'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { useState, type ComponentProps } from 'react'
import { loggedInUser } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface VerifyFormProps extends ComponentProps<'div'> {
  email: string
}

const verifySchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(30, 'Password must be at most 30 characters long'),
})

export function VerifyForm({ email, className, ...props }: VerifyFormProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onSubmit: verifySchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      const isValid = await loggedInUser(email, value.password)

      if (!isValid) return

      form.reset()
      setIsSubmitting(false)
      navigate({ to: '/', replace: true })
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
              Enter your password to verify your account.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <form.AppField name="password">
                {({ TextField }) => (
                  <TextField
                    label="Password"
                    type="password"
                    autoFocus
                    autoComplete="current-password"
                    placeholder="********"
                  />
                )}
              </form.AppField>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Login
            </Button>
          </div>
          <div className="text-muted-foreground text-center text-xs text-balance">
            Not sure about this email?{' '}
            <a href="/login" className="underline hover:text-primary">
              Change your email here
            </a>
            .
          </div>
        </div>
      </form>
    </div>
  )
}

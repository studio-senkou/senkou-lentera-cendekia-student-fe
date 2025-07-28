import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/use-form'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { useState, type ComponentProps } from 'react'
import { activateUserAccount } from '@/lib/user'
import { Loader2 } from 'lucide-react'

interface RegisterFormProps extends ComponentProps<'div'> {
  token: string
}

const registerSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(30, 'Password must be at most 30 characters long'),
})

export function RegisterForm({
  token,
  className,
  ...props
}: RegisterFormProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      const isActivationSuccess = await activateUserAccount(
        token,
        value.password,
      )

      if (!isActivationSuccess) {
        setIsSubmitting(false)
        return
      }

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
                  src="logo.png"
                  alt="Lentera Cendekia"
                  className="rounded-md h-auto w-auto max-w-24 max-h-24 object-contain"
                />
              </div>
              <span className="sr-only">Lentera Cendekia</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Lentera Cendekia</h1>
            <div className="text-center text-sm">
              Create a password to activate your account.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <form.AppField name="password">
                {({ TextField }) => (
                  <TextField
                    label="Password"
                    type="password"
                    placeholder="********"
                  />
                )}
              </form.AppField>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
              Login
            </Button>
          </div>
          <div className="text-muted-foreground text-center text-xs text-balance">
            By clicking "Activate", you will create an account and agree to our
            <a href="/terms" className="text-primary underline">
              {' '}
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary underline">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </form>
    </div>
  )
}

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/use-form'
import { verifyAccountByEmail } from '@/lib/auth'
import { Link, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      const isVerified = await verifyAccountByEmail(value.email)

      if (isVerified) {
        form.reset()
        navigate({
          to: '/verify',
          search: { email: value.email },
          replace: true,
        })
      } else {
        toast.error('This email is not registered as User.')
      }

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
              Please enter your email to continue.
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

            <Link
              to="/forgot-password"
              className="text-sm text-neutral-base hover:underline transition-all duration-300"
            >
              Forgot Password?
            </Link>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
              Login
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This feature will be supported soon!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

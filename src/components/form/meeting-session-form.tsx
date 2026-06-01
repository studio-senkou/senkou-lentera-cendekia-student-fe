import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/use-form'
import SignatureCanvas from 'react-signature-canvas'
import z from 'zod'
import { useRef, useState } from 'react'
import { Label } from '../ui/label'
import {
  attendMeetingSessionAsMentor,
  attendMeetingSessionAsStudent,
} from '@/lib/meeting-session'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export interface MeetingSessionFormProps {
  sessionId: number
}

const studentAttendSchema = z.object({
  session_proof: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Bukti kehadiran tidak boleh kosong',
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Hanya file gambar yang diperbolehkan',
    }),
})

export function MeetingSessionForm({
  sessionId,
  className,
  ...props
}: React.ComponentProps<'div'> & MeetingSessionFormProps) {
  const signatureRef = useRef<SignatureCanvas>(null)

  const form = useAppForm({
    defaultValues: {
      session_proof: undefined as unknown as File,
    },
    validators: {
      onSubmit: studentAttendSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Submitting form with values:', value)

      const sessionProofFile = value.session_proof
      const signatureFile = await generateSignatureFile()

      if (!sessionProofFile) {
        toast.error('Mohon upload bukti kehadiran')
        return
      }

      if (!signatureFile) {
        toast.error('Mohon buat tanda tangan terlebih dahulu')
        return
      }

      try {
        await attendMeetingSessionAsStudent(sessionId, {
          session_proof: sessionProofFile,
          signature: signatureFile,
        })

        toast.success('Kehadiran berhasil disubmit!')
        form.reset()
        signatureRef.current?.clear()
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to attend meeting session')
      }
    },
  })

  const generateSignatureFile = async (): Promise<File | null> => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      return null
    }

    return new Promise((resolve) => {
      const canvas = signatureRef.current?.getCanvas()
      if (!canvas) {
        resolve(null)
        return
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'signature.png', {
            type: 'image/png',
            lastModified: Date.now(),
          })
          resolve(file)
        } else {
          resolve(null)
        }
      }, 'image/png')
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()

          if (!signatureRef.current || signatureRef.current.isEmpty()) {
            toast.error('Mohon buat tanda tangan terlebih dahulu')
            return
          }

          form.handleSubmit(e)
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <form.AppField name="session_proof">
              {({ FileInput }) => (
                <FileInput
                  label="Bukti Kehadiran"
                  accept="image/*"
                  required
                  showPreview
                />
              )}
            </form.AppField>
          </div>
          <div className="grid gap-3 w-full">
            <Label className="mb-2 text-md font-medium">
              Tanda Tangan
              <span className="text-xs text-muted-foreground">
                (Gambar tanda tangan Anda)
              </span>
              <span className="text-red-500 ml-1">*</span>
            </Label>

            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: 'signature-canvas border rounded w-full',
                style: { width: '100%' },
              }}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-fit"
                onClick={() => signatureRef.current?.clear()}
              >
                Reset Tanda Tangan
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            {form.state.isSubmitting && (
              <Loader2 className="mr-2 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

MeetingSessionForm.displayName = 'MeetingSessionForm'

const mentorMeetingSchema = z.object({
  session_proof: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Bukti kehadiran tidak boleh kosong',
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Hanya file gambar yang diperbolehkan',
    }),
  session_feedback: z.string(),
})

export function MentorMeetingSessionForm({
  sessionId,
  className,
  ...props
}: React.ComponentProps<'div'> & MeetingSessionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      session_proof: undefined as unknown as File,
      session_feedback: '',
    },
    validators: {
      onSubmit: mentorMeetingSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      try {
        await attendMeetingSessionAsMentor(sessionId, value)
        form.reset()
      } catch (error) {
        toast.error('Failed to attend meeting session')
      }

      setIsSubmitting(false)
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(e)
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <form.AppField name="session_proof">
              {({ FileInput }) => (
                <FileInput
                  label="Bukti Kehadiran"
                  accept="image/*"
                  required
                  showPreview
                />
              )}
            </form.AppField>
          </div>

          <div className="grid gap-3">
            <form.AppField name="session_feedback">
              {({ TextArea }) => (
                <TextArea
                  label="Umpan Balik Sesi"
                  placeholder="Berikan umpan balik untuk sesi ini"
                  rows={4}
                  required
                />
              )}
            </form.AppField>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

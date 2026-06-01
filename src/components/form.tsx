import { useStore } from '@tanstack/react-form'
import { useState, useEffect } from 'react'

import { useFieldContext, useFormContext } from '../contexts/form-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import * as ShadcnSelect from '@/components/ui/select'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500 mt-1 text-sm font-medium"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function TextField({
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  className,
  ...props
}: {
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  className?: string
  [key: string]: any
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-md font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={label}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        className={cn(errors.length > 0 && 'border-red-500', className)}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function TextArea({
  label,
  rows = 3,
  cols,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  maxLength,
  minLength,
  wrap,
  resize = true,
  className,
  ...props
}: {
  label: string
  rows?: number
  cols?: number
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  maxLength?: number
  minLength?: number
  wrap?: 'hard' | 'soft' | 'off'
  resize?: boolean
  className?: string
  [key: string]: any
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-md font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <ShadcnTextarea
        id={label}
        value={field.state.value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        minLength={minLength}
        wrap={wrap}
        className={cn(
          !resize && 'resize-none',
          errors.length > 0 && 'border-red-500',
          className,
        )}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Select({
  label,
  values,
  placeholder,
  required = false,
  disabled = false,
  className,
  ...props
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2 text-xl font-bold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value}
        required={required}
        disabled={disabled}
        onValueChange={(value) => field.handleChange(value)}
        {...props}
      >
        <ShadcnSelect.SelectTrigger className={`w-full ${className || ''}`}>
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent>
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {values.map((value) => (
              <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  required = false,
  disabled = false,
  className,
  ...props
}: {
  label: string
  min?: number
  max?: number
  step?: number
  required?: boolean
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-md font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({field.state.value})
        </span>
      </Label>
      <ShadcnSlider
        id={label}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={className}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
        {...props}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Switch({
  label,
  required = false,
  disabled = false,
  className,
  ...props
}: {
  label: string
  required?: boolean
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          disabled={disabled}
          className={className}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
          {...props}
        />
        <Label htmlFor={label}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function FileInput({
  label,
  accept,
  multiple = false,
  required = false,
  disabled = false,
  maxSize,
  className,
  showPreview = false,
  ...props
}: {
  label: string
  accept?: string
  multiple?: boolean
  required?: boolean
  disabled?: boolean
  maxSize?: number // in bytes
  className?: string
  showPreview?: boolean
  [key: string]: any
}) {
  const field = useFieldContext<FileList | File | null>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) {
      field.handleChange(null)
      return
    }

    if (maxSize) {
      const oversizedFiles = Array.from(files).filter(
        (file) => file.size > maxSize,
      )
      if (oversizedFiles.length > 0) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
        alert(`Some files exceed the maximum size of ${maxSizeMB}MB`)
        return
      }
    }

    if (multiple) {
      field.handleChange(files)
    } else {
      field.handleChange(files[0])
    }
  }

  const getFileNames = () => {
    if (!field.state.value) return ''

    if (field.state.value instanceof FileList) {
      return Array.from(field.state.value)
        .map((file) => file.name)
        .join(', ')
    } else if (field.state.value instanceof File) {
      return field.state.value.name
    }
    return ''
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (file: File) => {
    return file.type.startsWith('image/')
  }

  const ImagePreview = ({ file }: { file: File }) => {
    const [preview, setPreview] = useState<string>('')

    useEffect(() => {
      if (isImage(file)) {
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
      }
    }, [file])

    if (!isImage(file) || !preview) return null

    return (
      <div className="mt-3">
        <img
          src={preview}
          alt={file.name}
          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )
  }

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-md font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {maxSize && (
          <span className="text-xs text-gray-500 ml-2">
            (Max: {formatFileSize(maxSize)})
          </span>
        )}
      </Label>

      <div className="relative">
        <Input
          id={label}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          className={cn(
            'h-14 file:mr-4 file:h-8 file:px-4 file:mb-5 file:rounded-sm file:text-sm file:font-medium file:bg-white file:text-neutral-dark file:border file:border-neutral-base file:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] file:cursor-pointer cursor-pointer',
            className,
          )}
          onBlur={field.handleBlur}
          onChange={handleFileChange}
          {...props}
        />

        {field.state.value && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Selected:</span> {getFileNames()}
            {field.state.value instanceof File && (
              <span className="ml-2 text-gray-500">
                ({formatFileSize(field.state.value.size)})
              </span>
            )}
            {field.state.value instanceof FileList &&
              field.state.value.length > 0 && (
                <span className="ml-2 text-gray-500">
                  ({field.state.value.length} file
                  {field.state.value.length > 1 ? 's' : ''})
                </span>
              )}
          </div>
        )}

        {/* Image Preview */}
        {showPreview && field.state.value instanceof File && (
          <ImagePreview file={field.state.value} />
        )}
      </div>

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

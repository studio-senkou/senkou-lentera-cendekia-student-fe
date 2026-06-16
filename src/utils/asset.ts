import { env } from '@/env'

export const getImageUrl = (filepath: string): string => {
  if (!filepath) return ''

  const baseUrl = env.VITE_IMAGE_SRC
  return `${baseUrl}/${filepath}`
}

export const getFileUrl = (filepath: string): string => {
  if (!filepath) return ''

  const baseUrl = env.VITE_APP_API_URL
  return `${baseUrl}/api/v1/files/${filepath}`
}

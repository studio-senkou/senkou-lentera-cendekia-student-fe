import { env } from '@/env'

export const getImageUrl = (filepath: string): string => {
  if (!filepath) return ''

  const baseUrl = env.VITE_IMAGE_SRC
  return `${baseUrl}/${filepath}`
}

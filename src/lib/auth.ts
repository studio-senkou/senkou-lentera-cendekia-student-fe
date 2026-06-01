import { toast } from 'sonner'
import { http } from './api'
import { useSession } from '@/stores/use-session'

export const verifyAccountByEmail = async (email: string) => {
  try {
    const response = await http.post('/auth/verify-email', { email })

    return (
      response.status &&
      response.data?.status === 'success' &&
      response.data?.data?.role !== 'admin'
    )
  } catch (error) {
    return false
  }
}

export const loggedInUser = async (email: string, password: string) => {
  const authenticate = useSession.getState().authenticate

  try {
    const response = await http.post('/auth/login', { email, password })

    if (response.status === 200 && response.data?.status === 'success') {
      await authenticate(response.data.data)
      toast.success('Successfully logged in!')
      return true
    }
    return false
  } catch (error) {
    toast.error('Failed to log in user, please check your credentials')
  }
}

export const renewSession = async () => {
  const { refreshToken } = useSession.getState()

  try {
    const response = await http.put('/auth/refresh', { token: refreshToken })

    if (response.status === 200 && response.data?.status === 'success') {
      return response.data.data
    }
    throw new Error('Failed to renew session')
  } catch (error) {
    toast.error('Failed to renew session, please log in again')
    throw error
  }
}

export const verifyOneTimeToken = async (token: string) => {
  try {
    const response = await http.post('/auth/verify-token', { token })
    return response.status === 200 && response.data?.status === 'success'
  } catch (error) {
    toast.error(
      'Failed to verify token, please contact support if the issue persists',
    )
    return false
  }
}

import { toast } from 'sonner'
import { http } from './api'
import { useSession } from '@/stores/use-session'

export const getDetailUser = async () => {
  try {
    const response = await http.get('/users/me')
    return response.data.data.user
  } catch (error) {
    toast.error('Failed to fetch user details')
  }
}

export const activateUserAccount = async (token: string, password: string) => {
  const authenticate = useSession.getState().authenticate

  try {
    const response = await http.post('/users/activate', {
      activation_token: token,
      password,
    })

    if (response.status === 200 && response.data?.status === 'success') {
      await authenticate(response.data.data)
      toast.success('Account activated successfully!')
      return true
    }
  } catch (error) {
    toast.error('Failed to activate user account')
  }
}

export const requestResetPassword = async (email: string) => {
  try {
    const response = await http.post('/users/reset-password', {
      email,
    })

    if (response.status === 200 && response.data?.status === 'success') {
      toast.success('Reset password link sent to your email!')
      return true
    }
  } catch (error) {
    return false
  }
}

export const resetUserPassword = async (token: string, password: string) => {
  try {
    const response = await http.put('/users/update-password', {
      token,
      new_password: password,
      confirm_password: password,
    })

    if (response.status === 200 && response.data?.status === 'success') {
      toast.success('Password reset successfully!')
      return true
    }
  } catch (error) {
    toast.error('Failed to reset password')
  }
  return false
}

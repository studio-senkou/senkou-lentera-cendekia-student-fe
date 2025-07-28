import { env } from '@/env'
import { useSession } from '@/stores/use-session'
import axios from 'axios'
import { toast } from 'sonner'
import { renewSession } from './auth'

export const http = axios.create({
  baseURL: `${env.VITE_APP_API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

http.interceptors.request.use(
  (config) => {
    const accessToken = useSession.getState().accessToken

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

let retryCountMap = new WeakMap<any, number>()

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, clearToken } = useSession.getState()

    if (error.response?.status === 401) {
      let retries = retryCountMap.get(error.config) || 0

      if (retries >= 3) {
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (refreshToken) {
        retryCountMap.set(error.config, retries + 1)
        try {
          const data = await renewSession()
          error.config.headers.Authorization = `Bearer ${data.access_token}`
          return await http.request(error.config)
        } catch (renewError) {
          clearToken()
          toast.error('Failed to renew session. Please log in again.')
          window.location.href = '/login'
          return await Promise.reject(renewError)
        }
      } else {
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

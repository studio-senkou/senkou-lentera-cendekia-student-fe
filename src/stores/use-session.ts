import { create } from 'zustand'
import Cookies from 'js-cookie'
import { http } from '@/lib/api'

export interface SessionDTO {
  active_role: 'user' | 'mentor'
  access_token: string
  refresh_token: string
  access_token_expiry: string
  refresh_token_expiry: string
}

export interface SessionStore {
  activeRole: 'user' | 'mentor' | null
  accessToken: string | null
  refreshToken: string | null
  clearToken: () => void
  logout: () => Promise<void>
}

export interface SessionActions {
  authenticate: (dto: SessionDTO) => Promise<void>
  setActiveRole: (role: 'user' | 'mentor', expiry: string) => void
  setAccessToken: (token: string, expiry: string) => void
  setRefreshToken: (token: string, expiry: string) => void
}

export const useSession = create<SessionStore & SessionActions>()(
  (set, get) => ({
    accessToken: Cookies.get('accessToken') || null,
    setAccessToken: (token: string, expiry: string) => {
      Cookies.set('accessToken', token, {
        expires: new Date(expiry),
        secure: true,
        sameSite: 'Strict',
      })

      set({ accessToken: token })
    },
    refreshToken: Cookies.get('refreshToken') || null,
    setRefreshToken: (token: string, expiry: string) => {
      Cookies.set('refreshToken', token, {
        expires: new Date(expiry),
        secure: true,
        sameSite: 'Strict',
      })

      set({ refreshToken: token })
    },
    activeRole: Cookies.get('activeRole') as 'user' | 'mentor' | null,
    setActiveRole: (role: 'user' | 'mentor', expiry: string) => {
      set({ activeRole: role })
      Cookies.set('activeRole', role, {
        expires: new Date(expiry),
        secure: true,
        sameSite: 'Strict',
      })
    },
    authenticate: async ({
      active_role,
      access_token,
      access_token_expiry,
      refresh_token,
      refresh_token_expiry,
    }: SessionDTO) => {
      const { setAccessToken, setRefreshToken, setActiveRole } = get()
      setAccessToken(access_token, access_token_expiry)
      setRefreshToken(refresh_token, refresh_token_expiry)
      setActiveRole(active_role, refresh_token_expiry)
    },
    clearToken: () => {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('activeRole')
      set({ accessToken: null, refreshToken: null, activeRole: null })
    },
    logout: async () => {
      const { clearToken } = get()
      try {
        await http.delete('/auth/logout')
      } catch (error) {
        console.error('Failed to log out:', error)
      } finally {
        clearToken()
        window.location.href = '/login'
      }
    },
  }),
)

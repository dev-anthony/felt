const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// ─── Token helpers ────────────────────────────────────────────────────────────
// Access token is stored in localStorage after login/verify-otp.
// Every protected call pulls it from there automatically.

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

const authHeaders = (): Record<string, string> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data as T
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Session {
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  sound_words: string[]
  city: string | null
  default_aesthetic_id: string | null
  onboarding_complete: boolean
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Initiates signup — triggers OTP email.
   * Does not create the users row yet.
   */
  signup: (body: { email: string; password: string; name: string }) =>
    request<{ message: string; email: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * Verifies the 6-digit OTP.
   * On success returns a session + basic user object.
   * Saves access_token to localStorage automatically.
   */
  verifyOtp: async (body: { email: string; otp: string; name: string }) => {
    const data = await request<{ session: Session; user: User; message: string }>(
      '/api/auth/verify-otp',
      { method: 'POST', body: JSON.stringify(body) }
    )
    localStorage.setItem('access_token', data.session.access_token)
    localStorage.setItem('refresh_token', data.session.refresh_token)
    return data
  },

  /**
   * Resends the OTP to the given email.
   */
  resendOtp: (body: { email: string }) =>
    request<{ message: string }>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * Logs in an existing user.
   * Saves access_token to localStorage automatically.
   */
  login: async (body: { email: string; password: string }) => {
    const data = await request<{ session: Session; user: User }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify(body) }
    )
    localStorage.setItem('access_token', data.session.access_token)
    localStorage.setItem('refresh_token', data.session.refresh_token)
    return data
  },

  /**
   * Logs out and clears the stored tokens.
   */
  logout: async () => {
    await request<{ message: string }>('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingApi = {
  /**
   * Uploads the artist photo.
   * Sends as multipart/form-data — do NOT pass Content-Type manually.
   * Returns the public avatarUrl stored in Supabase Storage.
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch(`${BASE_URL}/api/onboarding/upload-avatar`, {
      method: 'POST',
      headers: authHeaders(), // no Content-Type — browser sets it for FormData
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Avatar upload failed')
    return data
  },

  /**
   * Saves the completed onboarding profile.
   * Call this on the final step after all data is collected.
   */
  complete: (body: {
    soundWords: string[]
    city: string
    defaultAestheticId: string
    avatarUrl: string | null
  }) =>
    request<{ user: User }>('/api/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
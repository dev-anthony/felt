
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    // CRITICAL: Tells the browser to send cookies along with the API request
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
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
export interface UploadRecord {
  id: string
  title: string
  track_type: 'vocal' | 'instrumental'
  status: 'uploaded' | 'analyzed' | 'generating' | 'complete'
  audio_url: string
  sentence_prompt: string
  created_at: string
  audio_features?: {
    bpm: number
    key: string
    scale: string
    energy: number
    valence: number
    danceability: number
    acousticness: number
    spectral_brightness: number
    loudness: number
    mood: 'happy' | 'sad' | 'aggressive' | 'relaxed'
    speechiness: number | null
  }
  generations?: Array<{
    id: string
    filter_id: string
    variant_selected: string
    image_url: string
    status: string
    created_at: string
  }>
}
// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (body: { email: string; password: string; name: string }) =>
    request<{ message: string; email: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyOtp: async (body: { email: string; otp: string; name: string }) => {
    return request<{ user: User; message: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body)
    })
  },

  resendOtp: (body: { email: string }) =>
    request<{ message: string }>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: async (body: { email: string; password: string }) => {
    return request<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    })
  },

  logout: async () => {
    await request<{ message: string }>('/api/auth/logout', { method: 'POST' })
  },
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingApi = {
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch(`${BASE_URL}/api/onboarding/upload-avatar`, {
      method: 'POST',
      credentials: 'include', // explicitly pass down session cookie for uploading
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Avatar upload failed')
    return data
  },

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
// Add this below the onboardingApi block inside your src/lib/api.ts file

// ─── User Profile ─────────────────────────────────────────────────────────────

export const userApi = {
  /**
   * Retrieves full profile data for the currently authenticated user.
   */
  getMe: () => request<{ user: User }>('/api/user/me', { method: 'GET' }),

  /**
   * Partially updates specific profile fields for the authenticated user.
   */
  updateMe: (body: Partial<Pick<User, 'name' | 'sound_words' | 'city' | 'default_aesthetic_id' | 'avatar_url'>>) =>
    request<{ user: User }>('/api/user/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}
export const uploadApi = {
  /**
   * Dispatches audio file binary alongside metadata as multipart form data.
   */
  uploadTrack: async (file: File, title: string, sentencePrompt: string, trackType: 'vocal' | 'instrumental') => {
    const formData = new FormData()
    formData.append('audio', file)
    formData.append('title', title)
    formData.append('sentence_prompt', sentencePrompt)
    formData.append('track_type', trackType)

    const res = await fetch(`${BASE_URL}/api/uploads`, {
      method: 'POST',
      credentials: 'include', // Automatically passes HTTP-only cookies
      body: formData,         // Let the browser automatically set the correct boundary header
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Track processing failed')
    return data as { track: UploadRecord; pipeline_hint: 'TRANSCRIBE' | 'FEELING_EXPANDER' }
  },

  /**
   * Persists client-side audio analysis features.
   */
  submitAnalysis: (trackId: string, features: Record<string, any>) =>
    request<{ track: UploadRecord; pipeline_hint: 'TRANSCRIBE' | 'FEELING_EXPANDER' }>(`/api/uploads/${trackId}/analysis`, {
      method: 'POST',
      body: JSON.stringify(features),
    }),

  /**
   * Retrieves user history queue records.
   */
  getUploads: (limit = 20, offset = 0) =>
    request<{ uploads: UploadRecord[]; total: number; limit: number; offset: number }>(
      `/api/uploads?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    ),
}
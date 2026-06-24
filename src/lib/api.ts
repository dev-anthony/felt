
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Tracker reference variables to manage global lifecycle states on the client side
let refreshTimeoutId: any = null
let isRefreshingPromise: Promise<boolean> | null = null

/**
 * Predictive scheduler that runs background refresh dispatches 30–60 seconds 
 * before token decay parameters hit.
 */
export function scheduleTokenRefresh(expiresAtInSeconds: number) {
  if (refreshTimeoutId) clearTimeout(refreshTimeoutId)

  const currentTime = Math.floor(Date.now() / 1000)
  const timeUntilExpiration = expiresAtInSeconds - currentTime

  // Set a safe 45-second operational buffer window before decay limits
  const refreshBuffer = 45 
  const delayInSeconds = timeUntilExpiration - refreshBuffer

  // If the session is already inside the buffer, dispatch immediately. Otherwise, mount the countdown timer.
  const delayInMilliseconds = Math.max(delayInSeconds, 0) * 1000

  console.log(`[FELT Auth] Predictive background token refresh scheduled in ${Math.max(delayInSeconds, 0)}s`)

  refreshTimeoutId = setTimeout(async () => {
    try {
      console.log("[FELT Auth] Triggering proactive background session renewal loop...")
      const data = await authApi.refresh()
      if (data && data.expires_at) {
        scheduleTokenRefresh(data.expires_at)
      }
    } catch (error) {
      console.error("[FELT Auth] Predictive background loop collapsed. Evicting state gracefully:", error)
      handleGracefulFailoverLogout()
    }
  }, delayInMilliseconds)
}

/**
 * Triggers structural layout cleanup and forces navigation to the landing screen
 * without breaking client UI components with uncaught 401 response models.
 */
export async function handleGracefulFailoverLogout() {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }

  try {
    // Hits our updated backend sign-out layer which guarantees a safe 200 response
    await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  } catch (err) {
    console.error("[FELT Auth] Best-effort logout cleanup failed to resolve network handshake:", err)
  } finally {
    // Evict user back to landing view
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // Mandates that the browser sends along your HTTP-Only cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  // Intercept expired sessions on protected endpoints
  if (res.status === 401 && path !== '/api/auth/login' && path !== '/api/auth/signup' && path !== '/api/auth/refresh') {
    console.warn(`[FELT Network] Intercepted 401 on protected endpoint [${path}]. Attempting reactive recovery...`)
    
    try {
      // Deduplicate overlapping refresh requests using a shared promise block
      if (!isRefreshingPromise) {
        isRefreshingPromise = (async () => {
          const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          })
          
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json()
            if (refreshData?.expires_at) {
              scheduleTokenRefresh(refreshData.expires_at)
            }
            return true
          }
          return false
        })()
      }

      const refreshSuccessful = await isRefreshingPromise
      isRefreshingPromise = null // Clear memory reference immediately on resolution

      if (refreshSuccessful) {
        console.log(`[FELT Network] silents session recovery successful. Re-executing: ${path}`)
        // 2. Token successfully rotated! Re-execute the original network request
        res = await fetch(`${BASE_URL}${path}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        })
      } else {
        console.error("[FELT Network] Reactive token rotation verification rejected. Evicting user session.")
        handleGracefulFailoverLogout()
        throw new Error('Session validation failed. Re-authenticating.')
      }
    } catch (refreshError) {
      isRefreshingPromise = null
      console.error("Critical session rotation failure:", refreshError)
      handleGracefulFailoverLogout()
      throw refreshError
    }
  }

  // Handle file binary data streaming lookups manually for onboarding wrappers
  if (path.includes('/api/onboarding/upload-avatar') || path.includes('/api/uploads')) {
    if (options.method === 'POST' && options.body instanceof FormData) {
       // Return early since the explicit avatar and track functions handle their own res.json parsing blocks
       return {} as T
    }
  }

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

export interface Generation {
  id: string
  upload_id: string
  user_id: string
  prompt_used: string
  image_url: string
  status: 'complete' | 'generating' | 'failed'
  created_at: string
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
    genre: string
  }
  generations?: Generation[] // 👈 Clean layout matching single image data arrays
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (body: { email: string; password: string; name: string }) =>
    request<{ message: string; email: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyOtp: async (body: { email: string; otp: string; name: string }) => {
    const data = await request<{ user: User; message: string; session?: { expires_at: number } }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    
    const tokenLifeSpanTimestamp = data.session?.expires_at || (Math.floor(Date.now() / 1000) + 3600)
    scheduleTokenRefresh(tokenLifeSpanTimestamp)
    
    return data
  },

  resendOtp: (body: { email: string }) =>
    request<{ message: string }>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: async (body: { email: string; password: string }) => {
    const data = await request<{ user: User; session?: { expires_at: number } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    
    const tokenLifeSpanTimestamp = data.session?.expires_at || (Math.floor(Date.now() / 1000) + 3600)
    scheduleTokenRefresh(tokenLifeSpanTimestamp)
    
    return data
  },

  refresh: () =>
    request<{ message: string; expires_at: number }>('/api/auth/refresh', {
      method: 'POST',
    }),

  logout: async () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId)
      refreshTimeoutId = null
    }
    await request<{ message: string }>('/api/auth/logout', { method: 'POST' })
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  },
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingApi = {
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch(`${BASE_URL}/api/onboarding/upload-avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      if (res.status === 401) {
        handleGracefulFailoverLogout()
      }
      throw new Error(data.error || 'Avatar upload failed')
    }
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

// ─── User Profile ─────────────────────────────────────────────────────────────

export const userApi = {
  getMe: () => request<{ user: User }>('/api/user/me', { method: 'GET' }),

  updateMe: (body: Partial<Pick<User, 'name' | 'sound_words' | 'city' | 'default_aesthetic_id' | 'avatar_url'>>) =>
    request<{ user: User }>('/api/user/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

export const uploadApi = {
  uploadTrack: async (file: File, title: string, sentencePrompt: string, trackType: 'vocal' | 'instrumental') => {
    const formData = new FormData()
    formData.append('audio', file)
    formData.append('title', title)
    formData.append('sentence_prompt', sentencePrompt)
    formData.append('track_type', trackType)

    const res = await fetch(`${BASE_URL}/api/uploads`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      if (res.status === 401) {
        handleGracefulFailoverLogout()
      }
      throw new Error(data.error || 'Track processing failed')
    }
    return data as { track: UploadRecord; pipeline_hint: 'TRANSCRIBE' | 'FEELING_EXPANDER' }
  },

  submitAnalysis: (trackId: string, features: any) =>
    request<{ track: UploadRecord; pipeline_hint: 'TRANSCRIBE' | 'FEELING_EXPANDER' }>(`/api/uploads/${trackId}/analysis`, {
      method: 'POST',
      body: JSON.stringify(features),
    }),

  getUploads: (limit = 20, offset = 0) =>
    request<{ uploads: UploadRecord[]; total: number; limit: number; offset: number }>(
      `/api/uploads?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    ),
}

// ─── Generations ──────────────────────────────────────────────────────────────

export const generationApi = {
  expand: (body: { upload_id: string; basic_input: string }) =>
    request<{ original: string; expanded: string }>('/api/generations/expand', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    refine: async (body: { upload_id: string; lyric_context: string; image_url?: string | null }) => {
    return request<{ generation_id: string; image_url: string }>("/generations/refine", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
  
  transcribe: (body: { upload_id: string }) =>
    request<{ transcript: string; upload_id: string }>('/api/generations/transcribe', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  generate: (body: {
    upload_id: string
    lyric_context: string
    genre?: string
  }) =>
    request<{
      generation_id: string
      image_url: string
    }>('/api/generations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  getByUpload: (uploadId: string) =>
    request<{ generations: Generation[] }>(`/api/generations/${uploadId}`, {
      method: 'GET'
    }),
}
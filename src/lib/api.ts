const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';


let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null
let isRefreshingPromise: Promise<boolean> | null = null

export function scheduleTokenRefresh(expiresAtInSeconds: number) {
  if (refreshTimeoutId) clearTimeout(refreshTimeoutId)

  const currentTime = Math.floor(Date.now() / 1000)
  const timeUntilExpiration = expiresAtInSeconds - currentTime


  const refreshBuffer = 45 
  const delayInSeconds = timeUntilExpiration - refreshBuffer
  const delayInMilliseconds = Math.max(delayInSeconds, 0) * 1000

  // console.log(`[FELT Auth] Predictive background token refresh scheduled in ${Math.max(delayInSeconds, 0)}s`)

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

export async function handleGracefulFailoverLogout() {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }

  try {
    await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  } catch {
    // Best-effort cleanup: the cookie is cleared client-side regardless.
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
}

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (res.status === 401 && path !== '/api/auth/login' && path !== '/api/auth/signup' && path !== '/api/auth/refresh') {
    console.warn(`[FELT Network] Intercepted 401 on protected endpoint [${path}]. Attempting reactive recovery...`)
    
    try {
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
      isRefreshingPromise = null 

      if (refreshSuccessful) {
        // console.log(`[FELT Network] silents session recovery successful. Re-executing: ${path}`)
        res = await fetch(`${BASE_URL}${path}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        })
      } else {
        // console.error("[FELT Network] Reactive token rotation verification rejected. Evicting user session.")
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

  if (path.includes('/api/onboarding/upload-avatar') || path.includes('/api/uploads')) {
    if (options.method === 'POST' && options.body instanceof FormData) {
       return {} as T
    }
  }

  const data = await res.json()

  if (!res.ok) {
    // The backend returns a human-readable `detail` for provider failures
    // (e.g. 402 "Image provider credits exhausted"). Surface it when present so
    // the UI can tell the user what actually happened instead of a generic error.
    throw new Error(data.detail || data.error || 'Something went wrong')
  }

  return data as T
}

// ─── Types 
/** An option served by GET /api/onboarding/options — never hardcode these. */
export interface ProfileOption {
  id: string
  label: string
}

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  sound_words: string[]
  city: string | null
  /** Artist's declared lane — corrects Essentia's culture-blind genre guess. */
  default_genre: string | null
  /** 'auto' | 'figure' | 'no_people' — whether a person appears on covers. */
  default_subject_mode: string | null
  onboarding_complete: boolean
}

/** One of the 10 storytelling techniques the backend matches to a track. */
export type Technique =
  | 'FLASH_DOCUMENTARY'
  | 'VINTAGE_FILM_NOSTALGIA'
  | 'SILHOUETTE_ATMOSPHERE'
  | 'SURREAL_PRACTICAL_METAPHOR'
  | 'DUOTONE_COLOR_WASH'
  | 'MACRO_INTIMATE_DETAIL'
  | 'MOTION_BLUR_STROBE'
  | 'MIRROR_DOUBLE_EXPOSURE'
  | 'STUDIO_SEAMLESS_EDITORIAL'
  | 'MONUMENTAL_SCALE_ISOLATION'

export interface Generation {
  id: string
  upload_id: string
  user_id: string
  prompt_used: string
  image_url: string
  /** Persisted by the backend on every generation — surfaced in the gallery. */
  technique?: Technique
  status: 'complete' | 'generating' | 'failed'
  created_at: string
}

/** The Essentia-derived feature payload the client extracts and the backend stores. */
export interface AudioFeatures {
  bpm: number
  key: string
  scale: string
  energy: number
  valence: number
  danceability: number
  acousticness: number
  spectral_brightness: number
  loudness: number
  mood: string
  speechiness: number | null
  genre: string
}

export interface UploadRecord {
  id: string
  title: string
  track_type: 'vocal' | 'instrumental'
  status: 'uploaded' | 'analyzed' | 'generating' | 'complete'
  audio_url: string
  sentence_prompt: string
  created_at: string
  audio_features?: AudioFeatures
  generations?: Generation[]
}

//Auth

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

// ─── Onboarding

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

  /** Genre + subject-mode choices, served by the backend so the UI can't drift. */
  getOptions: () =>
    request<{ genres: ProfileOption[]; subjectModes: ProfileOption[] }>('/api/onboarding/options', {
      method: 'GET',
    }),

  complete: (body: {
    soundWords: string[]
    city: string
    genre: string
    subjectMode: string
    avatarUrl: string | null
  }) =>
    request<{ user: User }>('/api/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

//User Profile

export const userApi = {
  getMe: () => request<{ user: User }>('/api/user/me', { method: 'GET' }),

  updateMe: (body: Partial<Pick<User, 'name' | 'sound_words' | 'city' | 'default_genre' | 'default_subject_mode' | 'avatar_url'>>) =>
    request<{ user: User }>('/api/user/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}

//Upload

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

  submitAnalysis: (trackId: string, features: AudioFeatures) =>
    request<{ track: UploadRecord; pipeline_hint: 'TRANSCRIBE' | 'FEELING_EXPANDER' }>(`/api/uploads/${trackId}/analysis`, {
      method: 'POST',
      body: JSON.stringify(features),
    }),
  transcribeTrack: (uploadId: string, artistName?: string) =>
    request<{
      transcript: string
      expanded: string
      technique: Technique
      upload_id: string
      source?: 'genius' | 'deepgram' | 'none'
      matched?: { title: string; artist: string }
    }>(`/api/generations/transcribe`, {
      method: 'POST',
      body: JSON.stringify({ upload_id: uploadId, artist_name: artistName }),
    }),

  getUploads: (limit = 20, offset = 0) =>
    request<{ uploads: UploadRecord[]; total: number; limit: number; offset: number }>(
      `/api/uploads?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    ),

  deleteTrack: (trackId: string) =>
    request<{ message: string }>(`/api/uploads/${trackId}`, {
      method: 'DELETE',
    }),
}

export const generationApi = {
  expand: (body: { upload_id: string; basic_input: string }) =>
    request<{ original: string; expanded: string; technique: Technique }>('/api/generations/expand', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  refine: (body: { upload_id: string; lyric_context: string; image_url?: string | null }) =>
    request<{ generation_id: string; image_url: string; technique: Technique }>('/api/generations/refine', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // `technique` is optional: when omitted the backend reuses the technique it
  // already matched and stored during /expand or /transcribe.
  generate: (body: {
    upload_id: string
    lyric_context?: string
    technique?: Technique
  }) =>
    request<{
      generation_id: string
      image_url: string
      technique: Technique
    }>('/api/generations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getByUpload: (uploadId: string) =>
    request<{ generations: Generation[] }>(`/api/generations/${uploadId}`, {
      method: 'GET'
    }),
}
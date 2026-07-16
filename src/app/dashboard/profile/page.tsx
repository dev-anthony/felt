"use client"

import * as React from "react"
import Image from "next/image"
import { useUser } from "@/context/userContext"
import { userApi, onboardingApi, type ProfileOption } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, Loader2, Upload, X } from "lucide-react"

// The backend enforces EXACTLY three sound words on both /onboarding/complete
// and PATCH /user/me — any other count is rejected with a 400.
const SOUND_WORDS_REQUIRED = 3

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser()

  const [name, setName] = React.useState("")
  const [city, setCity] = React.useState("")
  const [soundWords, setSoundWords] = React.useState<string[]>([])
  const [wordDraft, setWordDraft] = React.useState("")
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [genre, setGenre] = React.useState<string>("")
  const [subjectMode, setSubjectMode] = React.useState<string>("auto")

  // Options come from the backend so this screen can never drift from what the
  // API validates.
  const [genreOptions, setGenreOptions] = React.useState<ProfileOption[]>([])
  const [subjectOptions, setSubjectOptions] = React.useState<ProfileOption[]>([])

  React.useEffect(() => {
    let cancelled = false
    onboardingApi
      .getOptions()
      .then((data) => {
        if (cancelled) return
        setGenreOptions(data.genres)
        setSubjectOptions(data.subjectModes)
      })
      .catch(() => {
        /* non-fatal: the rest of the profile still works */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  // Hydrate the form once the session user resolves, and re-hydrate if the
  // account changes. This is React's documented "adjust state while rendering"
  // pattern for state derived from props/context — cheaper and more correct than
  // doing it in an effect (which would render once with empty fields first).
  const [hydratedFor, setHydratedFor] = React.useState<string | null>(null)
  if (user && hydratedFor !== user.id) {
    setHydratedFor(user.id)
    setName(user.name ?? "")
    setCity(user.city ?? "")
    setSoundWords(user.sound_words ?? [])
    setAvatarUrl(user.avatar_url ?? null)
    setGenre(user.default_genre ?? "")
    setSubjectMode(user.default_subject_mode ?? "auto")
  }

  const soundWordsValid = soundWords.length === SOUND_WORDS_REQUIRED

  const dirty =
    !!user &&
    (name !== (user.name ?? "") ||
      city !== (user.city ?? "") ||
      avatarUrl !== (user.avatar_url ?? null) ||
      genre !== (user.default_genre ?? "") ||
      subjectMode !== (user.default_subject_mode ?? "auto") ||
      soundWords.join("|") !== (user.sound_words ?? []).join("|"))

  const addWord = () => {
    const w = wordDraft.trim()
    if (!w || soundWords.includes(w) || soundWords.length >= SOUND_WORDS_REQUIRED) return
    setSoundWords((prev) => [...prev, w])
    setWordDraft("")
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { avatarUrl: url } = await onboardingApi.uploadAvatar(file)
      setAvatarUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Avatar upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await userApi.updateMe({
        name,
        city,
        sound_words: soundWords,
        avatar_url: avatarUrl,
        default_genre: genre,
        default_subject_mode: subjectMode,
      })
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full px-4 sm:px-8 py-8 sm:py-12 max-w-2xl">
        <Skeleton className="h-10 w-40 rounded-none" />
        <div className="space-y-4 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-none" />
          ))}
        </div>
      </div>
    )
  }

  const inputClass =
    "rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
  const labelClass = "font-mono text-[9px] uppercase tracking-widest text-muted-foreground"

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-2xl">
        <div className="border-b border-border/40 pb-6">
          <h1 className="font-display italic text-3xl sm:text-4xl tracking-tight text-foreground">Profile</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2 truncate">
            {user?.email}
          </p>
        </div>

        {error && <p className="font-mono text-[10px] text-red-400 tracking-wide mt-6">{error}</p>}

        {/* Avatar */}
        <div className="flex items-center gap-5 mt-8">
          <div className="relative size-20 shrink-0 overflow-hidden border border-border/40 bg-neutral-900">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display italic text-2xl text-muted-foreground">
                {(name || user?.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="shrink-0 whitespace-nowrap flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest border border-border/80 px-4 h-10 text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
            >
              {uploading ? <Loader2 className="size-3 shrink-0 animate-spin" /> : <Upload className="size-3 shrink-0" />}
              {uploading ? "Uploading…" : "Change photo"}
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-5 mt-8">
          <div className="space-y-1.5">
            <label className={labelClass}>Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>City / Influence</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Sound words (exactly {SOUND_WORDS_REQUIRED}) — {soundWords.length}/{SOUND_WORDS_REQUIRED}
            </label>
            <div className="flex gap-2">
              <Input
                value={wordDraft}
                onChange={(e) => setWordDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addWord()
                  }
                }}
                placeholder="moody"
                disabled={soundWords.length >= SOUND_WORDS_REQUIRED}
                className={`${inputClass} flex-1 min-w-0`}
              />
              <button
                onClick={addWord}
                disabled={!wordDraft.trim() || soundWords.length >= SOUND_WORDS_REQUIRED}
                className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest border border-border/80 px-4 h-10 text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-30"
              >
                Add
              </button>
            </div>
            {soundWords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {soundWords.map((w) => (
                  <span
                    key={w}
                    className="inline-flex items-center gap-1.5 border border-border/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-foreground"
                  >
                    {w}
                    <button
                      onClick={() => setSoundWords((prev) => prev.filter((x) => x !== w))}
                      aria-label={`Remove ${w}`}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lane — corrects the analyser's culture-blind genre guess */}
        {genreOptions.length > 0 && (
          <div className="space-y-1.5 mt-5">
            <label className={labelClass}>Your lane</label>
            <p className="font-mono text-[9px] text-muted-foreground/70 leading-relaxed">
              Grounds covers culturally — the analyser hears tempo and texture, not where your sound comes from.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {genreOptions.map((opt) => {
                const active = genre === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setGenre(opt.id)}
                    className={`shrink-0 whitespace-nowrap h-9 px-3 border font-mono text-[9px] uppercase tracking-widest transition-colors ${
                      active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Who's on the cover */}
        {subjectOptions.length > 0 && (
          <div className="space-y-1.5 mt-5">
            <label className={labelClass}>Who&apos;s on the cover</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {subjectOptions.map((opt) => {
                const active = subjectMode === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSubjectMode(opt.id)}
                    className={`shrink-0 whitespace-nowrap h-9 px-3 border font-mono text-[9px] uppercase tracking-widest transition-colors ${
                      active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-border/30">
          <button
            onClick={handleSave}
            disabled={saving || !dirty || !soundWordsValid}
            className="shrink-0 whitespace-nowrap flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-5 h-10 hover:bg-foreground/90 transition-colors disabled:opacity-40"
          >
            {saving ? <Loader2 className="size-3 shrink-0 animate-spin" /> : <Check className="size-3 shrink-0" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
          {!soundWordsValid && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Add exactly {SOUND_WORDS_REQUIRED} sound words to save
            </span>
          )}
          {saved && soundWordsValid && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500">Saved</span>
          )}
        </div>
      </div>
    </div>
  )
}

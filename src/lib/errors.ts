/**
 * Error narrowing helpers.
 *
 * TypeScript types a `catch` binding as `unknown` under `strict`, which is
 * correct — a thrown value need not be an Error. The codebase previously
 * sidestepped that with `catch (err: any)` and then read `err.message`, which
 * silently returns `undefined` when something non-Error is thrown (a string, a
 * rejected fetch value, `null`). These helpers narrow it honestly instead.
 */

/** Best-effort human-readable message for any thrown value. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === "string" && err) return err
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === "string" && m) return m
  }
  return fallback
}

export function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Persistence is best-effort (e.g. storage full or disabled) — keep the app
    // running, but surface the failure instead of swallowing it silently.
    console.warn(`Failed to persist "${key}" to localStorage`, err);
  }
}
export function loadJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    // Corrupt or unreadable value — fall back to defaults rather than crash.
    console.warn(`Failed to read "${key}" from localStorage`, err);
    return null;
  }
}

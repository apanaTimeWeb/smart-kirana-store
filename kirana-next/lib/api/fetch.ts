// No longer used — data is served from lib/data.json via lib/api/store.ts
export function apiFetch<T>(_url: string, _options?: RequestInit): Promise<T> {
  return Promise.reject(new Error("apiFetch is disabled. Using local data store."));
}

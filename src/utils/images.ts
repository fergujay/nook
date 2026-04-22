import manifest from './mediaManifest.json'

type ManifestEntry = { url: string; hash?: string; bytes?: number; uploadedAt?: string }
const mediaManifest = manifest as Record<string, ManifestEntry>

/**
 * Resolve a public asset path to its final URL.
 *
 * Order of precedence:
 *   1. Uploaded Vercel Blob URL (from src/utils/mediaManifest.json)
 *   2. Vite base URL prefix + local public path
 */
export function getAssetPath(path: string): string {
  if (!path) return path
  const normalized = path.startsWith('/') ? path : `/${path}`

  const entry = mediaManifest[normalized]
  if (entry?.url) return entry.url

  const baseUrl = import.meta.env.BASE_URL || '/'
  return `${baseUrl}${normalized.slice(1)}`
}

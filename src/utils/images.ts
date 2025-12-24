/**
 * Get the correct path for public assets, accounting for base URL
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // Get base URL (e.g., '/nook/' or '/')
  const baseUrl = import.meta.env.BASE_URL || '/'
  // Combine base URL with path
  return `${baseUrl}${cleanPath}`
}







import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('getAssetPath', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('falls back to base URL + path when not in the manifest', async () => {
    vi.doMock('./mediaManifest.json', () => ({ default: {} }))
    const { getAssetPath } = await import('./images')
    expect(getAssetPath('/products/foo.jpg')).toBe('/products/foo.jpg')
    expect(getAssetPath('products/foo.jpg')).toBe('/products/foo.jpg')
  })

  it('returns the Blob URL when the path is in the manifest', async () => {
    vi.doMock('./mediaManifest.json', () => ({
      default: {
        '/products/foo.jpg': {
          url: 'https://example.public.blob.vercel-storage.com/products/foo.jpg',
        },
      },
    }))
    const { getAssetPath } = await import('./images')
    expect(getAssetPath('/products/foo.jpg')).toBe(
      'https://example.public.blob.vercel-storage.com/products/foo.jpg'
    )
  })

  it('returns the input unchanged for empty values', async () => {
    vi.doMock('./mediaManifest.json', () => ({ default: {} }))
    const { getAssetPath } = await import('./images')
    expect(getAssetPath('')).toBe('')
  })
})

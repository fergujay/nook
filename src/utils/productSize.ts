import type { Product } from '../data/products'

/** U+2300 DIAMETER SIGN — single convention for round dimensions in UI. */
const DIAMETER = '\u2300'

function sizeAlreadyShowsCm(s: string): boolean {
  return /\bcm\b/i.test(s)
}

/**
 * Size shown in listings and product detail. All numeric dimensions are treated as centimetres.
 * - Rectangular / generic `W x H` → `W × H cm`
 * - Round with equal sides `W x W` → `⌀ W cm`
 * - Round with `⌀ n` or `∅ n` → normalised `⌀ n cm`
 */
export function formatProductDisplaySize(product: Pick<Product, 'size' | 'shape'>): string | undefined {
  const raw = product.size?.trim()
  if (!raw) return undefined
  if (sizeAlreadyShowsCm(raw)) return raw

  const trimmed = raw.trim()

  if (product.shape === 'round') {
    const stripped = raw.replace(/^[\s\u2300\u2205∅⌀]+/u, '').trim()
    if (stripped !== trimmed) {
      return `${DIAMETER} ${stripped} cm`.replace(/\s+/g, ' ')
    }

    const square = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(trimmed)
    if (square) {
      const a = parseInt(square[1], 10)
      const b = parseInt(square[2], 10)
      if (a === b) return `${DIAMETER} ${a} cm`
    }

    return `${trimmed} cm`
  }

  const rect = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(trimmed)
  if (rect) {
    return `${rect[1]} × ${rect[2]} cm`
  }

  return `${trimmed} cm`
}

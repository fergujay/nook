#!/usr/bin/env node
/**
 * Upload static media from ./public to Vercel Blob and write a manifest
 * mapping original public paths (e.g. "/products/1/main.jpg") to their
 * public Blob URLs. The manifest is consumed at runtime by
 * src/utils/images.ts → getAssetPath().
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=xxx yarn upload:media
 *
 * Flags (via env):
 *   FORCE_REUPLOAD=1   re-upload files already present in the manifest
 *   DRY_RUN=1          list what would be uploaded but do nothing
 *   MEDIA_DIRS=a,b,c   override which subfolders of public/ to upload
 */

import { readdir, readFile, writeFile, stat, mkdir } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')
const publicDir = join(projectRoot, 'public')

const MEDIA_DIRS = (process.env.MEDIA_DIRS || 'products,slider,videos')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const MEDIA_EXTS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg',
  '.mp4', '.webm', '.mov',
])

const MANIFEST_PATH = join(projectRoot, 'src/utils/mediaManifest.json')

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (entry.isFile()) {
      files.push(full)
    }
  }
  return files
}

async function readManifest() {
  try {
    const raw = await readFile(MANIFEST_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeManifest(manifest) {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  )
  await mkdir(dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n')
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const dryRun = process.env.DRY_RUN === '1'
  const force = process.env.FORCE_REUPLOAD === '1'

  if (!token && !dryRun) {
    console.error('Error: BLOB_READ_WRITE_TOKEN env var is required.')
    console.error('')
    console.error('Create a Vercel Blob store:')
    console.error('  1. vercel.com → your project → Storage → Create → Blob')
    console.error('  2. Copy the BLOB_READ_WRITE_TOKEN from the store settings')
    console.error('  3. BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... yarn upload:media')
    console.error('')
    console.error('Or run with DRY_RUN=1 to preview without uploading.')
    process.exit(1)
  }

  let put
  if (!dryRun) {
    try {
      ;({ put } = await import('@vercel/blob'))
    } catch {
      console.error('Error: @vercel/blob is not installed. Run: yarn add -D @vercel/blob')
      process.exit(1)
    }
  }

  const manifest = await readManifest()
  let uploaded = 0
  let skipped = 0
  let totalBytes = 0

  for (const subdir of MEDIA_DIRS) {
    const abs = join(publicDir, subdir)
    try {
      const s = await stat(abs)
      if (!s.isDirectory()) continue
    } catch {
      console.warn(`• skip missing: public/${subdir}`)
      continue
    }

    const files = await walk(abs)
    for (const file of files) {
      const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
      if (!MEDIA_EXTS.has(ext)) continue

      const rel = '/' + relative(publicDir, file).split(/[\\/]+/).join('/')
      const body = await readFile(file)
      const hash = sha256(body).slice(0, 10)
      totalBytes += body.length

      const existing = manifest[rel]
      if (!force && existing && existing.hash === hash) {
        skipped++
        continue
      }

      const blobPath = rel.replace(/^\//, '')
      console.log(`↑ ${rel} (${formatBytes(body.length)})`)

      if (dryRun) {
        uploaded++
        continue
      }

      const res = await put(blobPath, body, {
        access: 'public',
        token,
        addRandomSuffix: false,
        contentType: MIME[ext] || 'application/octet-stream',
        cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
        allowOverwrite: true,
      })

      manifest[rel] = {
        url: res.url,
        hash,
        bytes: body.length,
        uploadedAt: new Date().toISOString(),
      }
      uploaded++

      // Persist incrementally so a crash mid-run doesn't lose progress.
      await writeManifest(manifest)
    }
  }

  await writeManifest(manifest)

  console.log('')
  console.log(`Uploaded: ${uploaded}`)
  console.log(`Skipped (unchanged): ${skipped}`)
  console.log(`Total scanned: ${formatBytes(totalBytes)}`)
  console.log(`Manifest: ${relative(projectRoot, MANIFEST_PATH)}`)
  if (dryRun) console.log('(dry run — no uploads performed)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

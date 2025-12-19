import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        // Optimize images: convert to WebP, compress, and resize if needed
        if (url.searchParams.has('webp')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '85',
          })
        }
        // Default: compress JPEG/PNG to 85% quality
        return new URLSearchParams({
          quality: '85',
        })
      },
    }),
  ],
  base: process.env.VITE_BASE_URL || '/',
})




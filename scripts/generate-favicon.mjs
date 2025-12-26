import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

// Read the SVG file
const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

// Sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

console.log('Generating favicon files...');

// Generate PNG files - render at higher resolution then downscale for better quality
for (const { size, name } of sizes) {
  try {
    // For small sizes, render at 4x resolution then downscale for maximum quality
    // For larger sizes, 2x is sufficient
    const multiplier = size <= 48 ? 4 : 2;
    const renderSize = size * multiplier;
    await sharp(svgBuffer, {
      density: 300, // High DPI for better quality
    })
      .resize(renderSize, renderSize, {
        kernel: sharp.kernel.lanczos3,
      })
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: false,
        force: true,
      })
      .toFile(join(publicDir, name));
    console.log(`✓ Generated ${name} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${name}:`, error.message);
  }
}

// Generate favicon.ico (multi-size ICO file)
try {
  const icoSizes = [16, 32, 48];
  const icoImages = await Promise.all(
    icoSizes.map(size =>
      sharp(svgBuffer)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
        })
        .png()
        .toBuffer()
    )
  );

  // For ICO, we'll create a simple 32x32 version
  // Note: sharp doesn't directly support ICO, so we'll use PNG as favicon.ico
  // Most modern browsers accept PNG files with .ico extension
  // Render at higher resolution then downscale for better quality
  const icoRenderSize = 32 * 4;
  await sharp(svgBuffer, {
    density: 300, // High DPI for better quality
  })
    .resize(icoRenderSize, icoRenderSize, {
      kernel: sharp.kernel.lanczos3,
    })
    .resize(32, 32, {
      kernel: sharp.kernel.lanczos3,
    })
    .png({
      quality: 100,
      compressionLevel: 9,
      palette: false,
      force: true,
    })
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('✓ Generated favicon.ico');
} catch (error) {
  console.error('✗ Failed to generate favicon.ico:', error.message);
}

console.log('\n✅ Favicon generation complete!');


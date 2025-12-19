#!/bin/bash

# Video Optimization Script
# Optimizes the atelier background video for web use

VIDEO_INPUT="public/atelier-background-video.mp4"
VIDEO_OUTPUT_HD="public/videos/atelier-background-hd.mp4"
VIDEO_OUTPUT_MOBILE="public/videos/atelier-background-mobile.mp4"

# Create videos directory if it doesn't exist
mkdir -p public/videos

echo "🎥 Video Optimization Script"
echo "=========================="
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed"
    echo "   Install with: brew install ffmpeg"
    exit 1
fi

echo "✅ FFmpeg is installed"
echo ""

# Check if input file exists
if [ ! -f "$VIDEO_INPUT" ]; then
    echo "❌ Input video not found: $VIDEO_INPUT"
    exit 1
fi

echo "📹 Creating HD version (1920x1080)..."
ffmpeg -i "$VIDEO_INPUT" \
       -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
       -c:v libx264 \
       -preset slow \
       -crf 23 \
       -c:a aac \
       -b:a 128k \
       -movflags +faststart \
       "$VIDEO_OUTPUT_HD" \
       -y

if [ $? -eq 0 ]; then
    echo "✅ HD version created: $VIDEO_OUTPUT_HD"
    HD_SIZE=$(du -h "$VIDEO_OUTPUT_HD" | cut -f1)
    echo "   Size: $HD_SIZE"
else
    echo "❌ Failed to create HD version"
    exit 1
fi

echo ""
echo "📱 Creating mobile version (1280x720)..."
ffmpeg -i "$VIDEO_INPUT" \
       -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
       -c:v libx264 \
       -preset slow \
       -crf 23 \
       -c:a aac \
       -b:a 96k \
       -movflags +faststart \
       "$VIDEO_OUTPUT_MOBILE" \
       -y

if [ $? -eq 0 ]; then
    echo "✅ Mobile version created: $VIDEO_OUTPUT_MOBILE"
    MOBILE_SIZE=$(du -h "$VIDEO_OUTPUT_MOBILE" | cut -f1)
    echo "   Size: $MOBILE_SIZE"
else
    echo "❌ Failed to create mobile version"
    exit 1
fi

echo ""
echo "📊 Original video size:"
ORIGINAL_SIZE=$(du -h "$VIDEO_INPUT" | cut -f1)
echo "   $ORIGINAL_SIZE"

echo ""
echo "✅ Video optimization complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Update Home.tsx to use the optimized video"
echo "   2. Consider using the mobile version for smaller screens"
echo "   3. Test video playback in different browsers"


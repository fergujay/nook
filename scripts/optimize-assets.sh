#!/bin/bash

# Asset Optimization Script
# This script helps rename and optimize assets for the website

echo "🔧 Asset Optimization Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${YELLOW}⚠️  $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    fi
}

echo "Checking required tools..."
check_tool "ffmpeg" || echo "  Install: brew install ffmpeg (for video optimization)"
check_tool "imagemagick" || echo "  Install: brew install imagemagick (for image optimization)"
echo ""

# Function to rename slider images
rename_slider_images() {
    echo "📸 Renaming slider images..."
    cd public/slider
    
    counter=1
    for file in IMG_*.jpg; do
        if [ -f "$file" ]; then
            new_name=$(printf "hero-slider-%02d.jpg" $counter)
            echo "  $file -> $new_name"
            # Uncomment to actually rename:
            # mv "$file" "$new_name"
            counter=$((counter + 1))
        fi
    done
    
    cd ../..
    echo ""
}

# Function to suggest video optimization
optimize_video() {
    echo "🎥 Video Optimization Suggestions"
    echo "Current: 4622325-uhd_4096_2160_25fps.mp4"
    echo ""
    echo "Recommended commands (using FFmpeg):"
    echo ""
    echo "1. Create HD version (1920x1080):"
    echo "   ffmpeg -i public/4622325-uhd_4096_2160_25fps.mp4 \\"
    echo "          -vf scale=1920:1080 \\"
    echo "          -c:v libx264 -preset slow -crf 23 \\"
    echo "          -c:a aac -b:a 128k \\"
    echo "          public/videos/atelier-background-hd.mp4"
    echo ""
    echo "2. Create mobile version (1280x720):"
    echo "   ffmpeg -i public/4622325-uhd_4096_2160_25fps.mp4 \\"
    echo "          -vf scale=1280:720 \\"
    echo "          -c:v libx264 -preset slow -crf 23 \\"
    echo "          -c:a aac -b:a 96k \\"
    echo "          public/videos/atelier-background-mobile.mp4"
    echo ""
}

# Function to suggest image optimization
optimize_images() {
    echo "🖼️  Image Optimization Suggestions"
    echo ""
    echo "1. Compress existing images:"
    echo "   - Use TinyPNG: https://tinypng.com"
    echo "   - Or Squoosh: https://squoosh.app"
    echo ""
    echo "2. Convert to WebP (with ImageMagick):"
    echo "   for file in public/slider/*.jpg; do"
    echo "     convert \"\$file\" -quality 85 \"\${file%.jpg}.webp\""
    echo "   done"
    echo ""
    echo "3. Batch compress with ImageOptim (Mac):"
    echo "   - Download from: https://imageoptim.com"
    echo "   - Drag and drop folder to optimize"
    echo ""
}

# Main menu
echo "What would you like to do?"
echo "1. Show rename suggestions for slider images"
echo "2. Show video optimization commands"
echo "3. Show image optimization suggestions"
echo "4. Show all"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        rename_slider_images
        ;;
    2)
        optimize_video
        ;;
    3)
        optimize_images
        ;;
    4)
        rename_slider_images
        optimize_video
        optimize_images
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done! Review the suggestions above and apply them manually."
echo "💡 Tip: Always test after renaming/optimizing to ensure everything works!"


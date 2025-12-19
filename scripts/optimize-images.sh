#!/bin/bash

# Image Optimization Script using ImageMagick
# Optimizes all images in the public directory

echo "🖼️  Image Optimization Script (ImageMagick)"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick (convert) is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ImageMagick is installed${NC}"
echo ""

# Create backup directory
BACKUP_DIR="public/backups-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to optimize a single image
optimize_image() {
    local file=$1
    local original_size=$(du -h "$file" | cut -f1)
    
    # Create backup
    cp "$file" "$BACKUP_DIR/"
    
    # Optimize JPEG
    if [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
        echo "  Optimizing: $(basename $file) ($original_size)"
        magick "$file" \
            -strip \
            -quality 85 \
            -interlace Plane \
            -sampling-factor 4:2:0 \
            "$file"
        
        local new_size=$(du -h "$file" | cut -f1)
        echo -e "    ${GREEN}✅ Optimized: $original_size → $new_size${NC}"
    fi
}

# Optimize slider images
echo "📸 Optimizing slider images..."
TOTAL_SLIDER=0
for file in public/slider/*.jpg; do
    if [ -f "$file" ]; then
        optimize_image "$file"
        TOTAL_SLIDER=$((TOTAL_SLIDER + 1))
    fi
done
echo -e "${GREEN}✅ Optimized $TOTAL_SLIDER slider images${NC}"
echo ""

# Optimize product images
echo "🛍️  Optimizing product images..."
TOTAL_PRODUCT=0
for file in public/products/*/*.jpg; do
    if [ -f "$file" ]; then
        optimize_image "$file"
        TOTAL_PRODUCT=$((TOTAL_PRODUCT + 1))
    fi
done
echo -e "${GREEN}✅ Optimized $TOTAL_PRODUCT product images${NC}"
echo ""

# Optimize other images
echo "🖼️  Optimizing other images..."
if [ -f "public/our-story-background.jpg" ]; then
    optimize_image "public/our-story-background.jpg"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}✅ Image optimization complete!${NC}"
echo ""
echo "📊 Summary:"
echo "   - Slider images: $TOTAL_SLIDER"
echo "   - Product images: $TOTAL_PRODUCT"
echo "   - Backups saved to: $BACKUP_DIR"
echo ""
echo "💡 Original files backed up to: $BACKUP_DIR"
echo "   You can delete this folder after verifying everything works."


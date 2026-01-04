#!/bin/bash

# Build script for book-scale-extension
# Creates ZIP packages for Chrome Web Store and Firefox Add-ons

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/dist"
VERSION=$(grep -o '"version": *"[^"]*"' "$PROJECT_DIR/manifest.json" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building book-scale-extension v${VERSION}${NC}"
echo "=========================================="

# Clean and create build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Files to include in the build
INCLUDE_FILES=(
    "manifest.json"
    "src"
    "_locales"
    "icons"
)

# Build Chrome version
build_chrome() {
    echo -e "\n${YELLOW}Building Chrome extension...${NC}"

    local CHROME_DIR="$BUILD_DIR/chrome"
    mkdir -p "$CHROME_DIR"

    # Copy files
    for file in "${INCLUDE_FILES[@]}"; do
        cp -r "$PROJECT_DIR/$file" "$CHROME_DIR/"
    done

    # Create ZIP
    local ZIP_NAME="book-scale-extension-chrome-v${VERSION}.zip"
    cd "$CHROME_DIR"
    zip -r "$BUILD_DIR/$ZIP_NAME" . -x "*.DS_Store"
    cd "$PROJECT_DIR"

    echo -e "${GREEN}✓ Created: dist/$ZIP_NAME${NC}"
}

# Build Firefox version
build_firefox() {
    echo -e "\n${YELLOW}Building Firefox extension...${NC}"

    local FIREFOX_DIR="$BUILD_DIR/firefox"
    mkdir -p "$FIREFOX_DIR"

    # Copy files
    for file in "${INCLUDE_FILES[@]}"; do
        if [ "$file" != "manifest.json" ]; then
            cp -r "$PROJECT_DIR/$file" "$FIREFOX_DIR/"
        fi
    done

    # Use Firefox manifest
    cp "$PROJECT_DIR/manifest.firefox.json" "$FIREFOX_DIR/manifest.json"

    # Create ZIP
    local ZIP_NAME="book-scale-extension-firefox-v${VERSION}.zip"
    cd "$FIREFOX_DIR"
    zip -r "$BUILD_DIR/$ZIP_NAME" . -x "*.DS_Store"
    cd "$PROJECT_DIR"

    echo -e "${GREEN}✓ Created: dist/$ZIP_NAME${NC}"
}

# Parse arguments
if [ "$1" == "chrome" ]; then
    build_chrome
elif [ "$1" == "firefox" ]; then
    build_firefox
else
    build_chrome
    build_firefox
fi

echo -e "\n${GREEN}Build complete!${NC}"
echo "ZIP files are in: $BUILD_DIR"

# Show file sizes
echo -e "\n${YELLOW}Package sizes:${NC}"
ls -lh "$BUILD_DIR"/*.zip 2>/dev/null || true

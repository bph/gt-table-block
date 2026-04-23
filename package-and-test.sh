#!/bin/bash

# Package and Test Script for GT Table Block
# Runs the build, copies distribution files into the local SVN working copy's
# trunk directory, and mirrors the result into a WordPress Studio site for testing.

set -e  # Exit on error

echo "📦 Starting package and test process..."

# Configuration
PROJECT_DIR="/Users/pauli/gt-table-block"
SVN_TRUNK="$PROJECT_DIR/svn-local/gt-table-block/trunk"
WP_STUDIO_SITE="$HOME/studio/plugin-table-block/wp-content/plugins/gt-table-block"

# Files and directories to ship to wordpress.org.
# `languages/` is listed but optional — it is skipped if absent.
FILES_TO_COPY=(
    "gt-table-block.php"
    "readme.txt"
    "build"
    "languages"
)

echo "🔨 Building plugin assets..."
cd "$PROJECT_DIR"
npm run build

if [ ! -d "$PROJECT_DIR/build" ]; then
    echo "❌ Error: build/ directory missing after npm run build"
    exit 1
fi

echo "🗑️  Cleaning trunk directory..."
rm -rf "$SVN_TRUNK"
mkdir -p "$SVN_TRUNK"

echo "📋 Copying files to trunk..."
for item in "${FILES_TO_COPY[@]}"; do
    if [ -e "$item" ]; then
        echo "  ✓ Copying $item"
        cp -r "$item" "$SVN_TRUNK/"
    else
        echo "  ⊘ Skipping $item (not found)"
    fi
done

echo ""
echo "✅ Trunk updated successfully!"
echo ""

# Copy to WordPress Studio for testing
echo "🧪 Copying to WordPress Studio for testing..."

if [ -d "$WP_STUDIO_SITE" ]; then
    echo "  Removing old version..."
    rm -rf "$WP_STUDIO_SITE"
fi

mkdir -p "$(dirname "$WP_STUDIO_SITE")"
cp -r "$SVN_TRUNK" "$WP_STUDIO_SITE"

echo ""
echo "✅ Plugin copied to WordPress Studio!"
echo ""
echo "📍 Location: $WP_STUDIO_SITE"
echo ""
echo "Next steps:"
echo "  1. Open WordPress Studio (plugin-table-block)"
echo "  2. Go to Plugins page"
echo "  3. Activate and test the plugin"
echo "  4. When ready to release, run: ./deploy-tag.sh [version]"
echo ""

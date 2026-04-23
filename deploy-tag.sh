#!/bin/bash

# Deploy Tag Script for GT Table Block
# Creates a new tag from trunk in the local SVN working copy and commits to
# the WordPress.org plugin SVN repository.

set -e  # Exit on error

# Check if version argument is provided
if [ -z "$1" ]; then
    echo "❌ Error: Version number required"
    echo "Usage: ./deploy-tag.sh [version]"
    echo "Example: ./deploy-tag.sh 0.1.1"
    exit 1
fi

VERSION=$1

echo "🚀 Starting deployment for version $VERSION..."

# Configuration
PROJECT_DIR="/Users/pauli/gt-table-block"
SVN_DIR="$PROJECT_DIR/svn-local/gt-table-block"
SVN_TRUNK="$SVN_DIR/trunk"
SVN_TAG="$SVN_DIR/tags/$VERSION"

# Extract version from gt-table-block.php
PLUGIN_VERSION=$(grep -i "^\s*\*\s*Version:" "$PROJECT_DIR/gt-table-block.php" | awk '{print $3}' | tr -d '\r')

# Extract stable tag from readme.txt
README_VERSION=$(grep -i "^Stable tag:" "$PROJECT_DIR/readme.txt" | awk '{print $3}' | tr -d '\r')

echo ""
echo "🔍 Version Check:"
echo "  Deploy version:  $VERSION"
echo "  Plugin header:   $PLUGIN_VERSION"
echo "  Readme stable:   $README_VERSION"
echo ""

# Check if versions match
VERSIONS_MATCH=true
if [ "$VERSION" != "$PLUGIN_VERSION" ]; then
    echo "⚠️  WARNING: Deploy version ($VERSION) does not match plugin header version ($PLUGIN_VERSION)"
    echo "    File: gt-table-block.php (Version: field)"
    VERSIONS_MATCH=false
fi

if [ "$VERSION" != "$README_VERSION" ]; then
    echo "⚠️  WARNING: Deploy version ($VERSION) does not match readme stable tag ($README_VERSION)"
    echo "    File: readme.txt (Stable tag: field)"
    VERSIONS_MATCH=false
fi

if [ "$VERSIONS_MATCH" = false ]; then
    echo ""
    echo "❌ Deployment cancelled - version mismatch must be fixed"
    echo ""
    echo "Please update the version numbers to $VERSION in:"
    echo "  - gt-table-block.php (Version: field)"
    echo "  - readme.txt (Stable tag: field)"
    echo ""
    exit 1
fi

echo "✅ All versions match!"
echo ""

# Verify trunk exists and has files
if [ ! -d "$SVN_TRUNK" ] || [ -z "$(ls -A "$SVN_TRUNK")" ]; then
    echo "❌ Error: Trunk is empty or doesn't exist"
    echo "Run ./package-and-test.sh first to create trunk"
    exit 1
fi

# Check if tag already exists
if [ -d "$SVN_TAG" ]; then
    echo "⚠️  Warning: Tag $VERSION already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
    rm -rf "$SVN_TAG"
fi

echo "📋 Creating tag $VERSION from trunk..."
mkdir -p "$SVN_DIR/tags"
cp -r "$SVN_TRUNK" "$SVN_TAG"

echo "✅ Tag created successfully!"
echo ""
echo "📍 Tag location: $SVN_TAG"
echo ""

# Prompt for SVN commit
read -p "Do you want to commit to WordPress.org SVN now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$SVN_DIR"

    echo "📤 Adding tag directory to SVN..."
    svn add "tags/$VERSION" 2>/dev/null || true

    echo "📤 Adding trunk files to SVN..."
    svn add --force trunk/* 2>/dev/null || true

    echo "🗑️  Removing deleted files from SVN..."
    # Handle deleted files (macOS compatible - without -r flag)
    svn status | grep '^!' | awk '{print $2}' | while read file; do
        if [ -n "$file" ]; then
            svn delete "$file" 2>/dev/null || true
        fi
    done

    echo ""
    echo "📋 SVN Status:"
    svn status
    echo ""

    read -p "Commit message (or press Enter for default): " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Tagging version $VERSION"
    fi

    echo ""
    echo "🚀 Committing to WordPress.org..."
    svn commit -m "$COMMIT_MSG"

    echo ""
    echo "🎉 Successfully deployed version $VERSION to WordPress.org!"
    echo ""
    echo "Check your plugin page in 2-3 minutes:"
    echo "  https://wordpress.org/plugins/gt-table-block/"
else
    echo ""
    echo "⏸️  Tag created locally but not committed to WordPress.org"
    echo "To commit later, run:"
    echo "  cd $SVN_DIR"
    echo "  svn add tags/$VERSION"
    echo "  svn add --force trunk/*"
    echo "  svn commit -m 'Tagging version $VERSION'"
fi

echo ""

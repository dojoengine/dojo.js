#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -ex

# Clone the repository
git clone --depth 1 https://github.com/dojoengine/dojo.c dojo.c
cd dojo.c

# Build for web (browser)
npx wasm-pack build --out-dir ../dist/pkg/web --release --target web

# Build for Node.js
npx wasm-pack build --out-dir ../dist/pkg/node --release --target nodejs

# Find and delete .gitignore files in the specified directories
find ../dist/pkg/node -name ".gitignore" -type f -delete
find ../dist/pkg/web -name ".gitignore" -type f -delete


# Go back to the parent directory and delete the repository
cd ..
rm -rf dojo.c
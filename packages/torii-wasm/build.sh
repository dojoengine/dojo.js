#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -ex

# Clone the repository
git clone --depth 1 --branch grpc-update https://github.com/dojoengine/dojo.c dojo.c
cd dojo.c

# Build for web (browser)
npx wasm-pack build --out-dir ../pkg/web --release

# Build for Node.js
npx wasm-pack build --out-dir ../pkg/node --release --target nodejs

# Find and delete .gitignore files in the specified directories
find ../pkg/node -name ".gitignore" -type f -delete
find ../pkg/web -name ".gitignore" -type f -delete


# Go back to the parent directory and delete the repository
cd ..
rm -rf dojo.c
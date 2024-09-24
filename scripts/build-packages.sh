#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define an array of package directories
packages=(
  "packages/torii-wasm"
  "packages/utils-wasm"
  "packages/torii-client"
  "packages/state"
  "packages/core"
  "packages/create-burner"
  "packages/create-dojo"
  "packages/utils"
  "packages/react",
  "packages/sdk"
)

# Iterate over each package directory and run the build command
for package in "${packages[@]}"; do
  echo "Building $package..."
  pnpm --dir "$package" build
  
  # Run tests only for non-wasm packages and non-torii-client packages
  if [[ "$package" != *"-wasm" && "$package" != "packages/torii-client" ]]; then
    pnpm --dir "$package" test
  fi
done

echo "Build completed successfully."

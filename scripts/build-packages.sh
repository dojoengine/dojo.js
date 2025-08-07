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
  "packages/react"
  "packages/sdk"
  "packages/predeployed-connector"
)

# Iterate over each package directory and run the build command
for package in "${packages[@]}"; do
  echo "Building $package..."
  bun --cwd "$package" run build

  # Run tests only for non-wasm packages, non-torii-client packages, and create-dojo
  if [[ "$package" != *"-wasm" && "$package" != "packages/torii-client" && "$package" != "packages/create-dojo" ]]; then
    bun --cwd "$package" run test
  fi
done

echo "Build completed successfully."

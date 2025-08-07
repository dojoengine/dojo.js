#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define an array of example directories
examples=(
  "examples/example-nodejs-bot"
  "examples/example-vanillajs-phaser-recs"
  "examples/example-vite-react-app-recs"
  "examples/example-vite-react-phaser-recs"
  "examples/example-vite-react-pwa-recs"
  "examples/example-vite-react-sdk"
  "examples/example-vite-react-threejs-recs"
  "examples/example-vue-app-recs"
  "examples/example-vite-svelte-recs"
  "examples/example-vite-react-sql"
  "examples/example-vite-experimental-sdk"
  "examples/example-vite-phaser-sdk"
  "examples/example-vite-grpc-playground"
)

# Iterate over each example directory and run the build command
for example in "${examples[@]}"; do
  echo "Building in $example..."
  cd "$example"
  bun run build
  cd ../../
done

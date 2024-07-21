#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build commands for each example
pnpm run build-phaser
pnpm run build-react-app
pnpm run build-threejs
pnpm run build-react-pwa-app
pnpm run build-vue-app
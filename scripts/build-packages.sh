#!/bin/bash

# Stop on the first error
set -e

# Build commands
# pnpm build-torii-wasm
pnpm build-utils-wasm
# pnpm build-torii-client
pnpm build-state
pnpm build-core
pnpm build-create-burner
pnpm build-create-dojo
pnpm build-utils
pnpm build-react

echo "Build completed successfully."
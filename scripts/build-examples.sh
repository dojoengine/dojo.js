#!/bin/bash

set -e

SHOWCASE_DIR="example"

if [ ! -d "$SHOWCASE_DIR" ]; then
  echo "Showcase example not found at $SHOWCASE_DIR"
  exit 1
fi

echo "Building Dojo showcase example..."
bun run --cwd "$SHOWCASE_DIR" build

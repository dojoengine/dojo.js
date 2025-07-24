#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GRPC_DIR="$(dirname "$SCRIPT_DIR")"
PROTO_DIR="$GRPC_DIR/proto"

echo "Creating proto directory..."
mkdir -p "$PROTO_DIR"

GITHUB_BASE_URL="https://raw.githubusercontent.com/dojoengine/torii/main/crates/proto/proto"

PROTO_FILES=(
    "schema.proto"
    "types.proto"
    "world.proto"
)

for file in "${PROTO_FILES[@]}"; do
    echo "Downloading $file..."
    curl -s -o "$PROTO_DIR/$file" "$GITHUB_BASE_URL/$file"
    if [ $? -eq 0 ]; then
        echo "✓ Downloaded $file"
    else
        echo "✗ Failed to download $file"
        exit 1
    fi
done

echo "All proto files updated successfully!"
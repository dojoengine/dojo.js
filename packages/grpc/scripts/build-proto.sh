#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GRPC_DIR="$(dirname "$SCRIPT_DIR")"
PROTO_DIR="$GRPC_DIR/proto"
OUT_DIR="$GRPC_DIR/src/generated"

echo "Creating output directory..."
mkdir -p "$OUT_DIR"

# Check if protoc is available
if ! command -v protoc &>/dev/null; then
  echo "Error: protoc is not installed. Please install Protocol Buffers compiler."
  echo "On macOS: brew install protobuf"
  echo "On Ubuntu: apt-get install protobuf-compiler"
  exit 1
fi

# Find the protobuf-ts plugin
PROTOC_GEN_TS="$GRPC_DIR/../../node_modules/.bin/protoc-gen-ts"

if [ ! -f "$PROTOC_GEN_TS" ]; then
  echo "Error: @protobuf-ts/plugin not found. Run 'bun install' first."
  exit 1
fi

# Generate TypeScript code with protobuf-ts
echo "Generating TypeScript protobuf code with client support..."
protoc \
  --experimental_allow_proto3_optional \
  --proto_path="$PROTO_DIR" \
  --plugin="protoc-gen-ts=$PROTOC_GEN_TS" \
  --ts_out="$OUT_DIR" \
  --ts_opt=generate_dependencies \
  --ts_opt=output_typescript \
  --ts_opt=use_proto_field_name \
  --ts_opt=client_generic \
  "$PROTO_DIR"/*.proto

echo "Proto compilation complete!"

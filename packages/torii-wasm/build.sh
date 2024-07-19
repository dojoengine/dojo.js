#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -ex

# # Clone the repository
git clone --depth 1 --branch v1.0.0-alpha.0 https://github.com/dojoengine/dojo.c dojo.c
cd dojo.c

set -ex

npx wasm-pack build --out-dir ../pkg --release

# Go back to the parent directory and delete the repository
cd ..
rm -rf dojo.c
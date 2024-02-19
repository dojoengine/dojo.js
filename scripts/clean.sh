#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"/..

# Find and remove node_modules directories and bun.lockb files
find . -type d -name "node_modules" -exec rm -rf {} + \
    -o -type f -name "bun.lockb" -exec rm -f {} +

echo "Cleanup completed."
#!/bin/bash

# Get all tags created in the last 5 minutes that match our pattern
RECENT_TAGS=$(git tag -l '@dojoengine/*@*' --sort=-committerdate | while read tag; do
  TAG_TIME=$(git log -1 --format=%ct "$tag")
  CURRENT_TIME=$(date +%s)
  TIME_DIFF=$((CURRENT_TIME - TAG_TIME))
  if [ $TIME_DIFF -lt 600 ]; then
    echo "$tag"
  fi
done)

# Store tags in a file for later processing
echo "$RECENT_TAGS" >recent_tags.txt
echo "Found recent tags:"
cat recent_tags.txt

---
"@dojoengine/utils": patch
"@dojoengine/sdk": patch
---

fix: ensure entity IDs are consistently padded across SDK

- Updated `getEntityIdFromKeys` to return properly padded entity IDs (66 characters: 0x + 64 hex)
- This fixes the issue where `waitForEntityChange` would return `undefined` when using entity IDs from `getEntityIdFromKeys`
- Entity IDs are now consistently padded whether they come from Torii or are generated manually
- Resolves issues #484 and #485

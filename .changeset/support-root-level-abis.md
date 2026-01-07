---
"@dojoengine/core": patch
---

Fix DojoProvider compatibility with manifests using root-level ABIs

Added support for manifest formats where ABIs are stored at `manifest.abis` instead of inline `contract.abi`. This enables DojoProvider to work with newer Dojo manifest structures.

Changes:
- Add `getContractAbi()` helper to resolve ABIs from either format
- Update `parseDojoCall()` to use the new helper
- Update DojoProvider constructor to fallback to `manifest.abis` for world contract
- Update `initializeActionMethods()` to use the new helper for contract ABIs

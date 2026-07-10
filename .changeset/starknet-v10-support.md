---
"@dojoengine/core": minor
"@dojoengine/create-burner": minor
"@dojoengine/create-dojo": minor
"@dojoengine/grpc": minor
"@dojoengine/internal": minor
"@dojoengine/predeployed-connector": minor
"@dojoengine/react": minor
"@dojoengine/sdk": minor
"@dojoengine/state": minor
"@dojoengine/utils": minor
---

Bump Starknet.js support to v10.0.2 and migrate React integrations to
Starknet Start.

Starknet.js peer and dependency versions now target v10.0.2, and packages
that load Starknet.js now require Node.js 22 or newer. React consumers use
`@starknet-start/react`, `@starknet-start/chains`, and
`@starknet-start/providers`, with wallet-standard connectors backed by Get
Starknet v5. Package-manager overrides keep Starknet Start's v9-compatible
dependency ranges on the workspace's single Starknet.js v10.0.2 instance.
Generated apps include the exact Starknet.js and Starknet Start versions,
React 19, and the matching Node.js requirement needed for clean package
installs.

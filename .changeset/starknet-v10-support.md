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

Bump Starknet.js support to v10.0.2.

Starknet.js peer and dependency versions now target v10.0.2, and packages
that load Starknet.js now require Node.js 22 or newer. Stable
`@starknet-react/core` currently still declares a `starknet` v8 peer range,
so installs pin Starknet.js through package-manager overrides until upstream
widens that peer range. Generated apps include the exact Starknet.js version
and matching Node.js requirement needed for clean package installs.

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

Bump Starknet.js support to v9.4.2.

Starknet.js peer and dependency ranges now target v9. Stable `@starknet-react/core` currently still declares a `starknet` v8 peer range, so installs pin Starknet.js through package-manager overrides until upstream widens that peer range. Generated React apps also include the Starknet React peer dependency needed for clean package installs.

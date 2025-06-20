# Change Log

## 1.5.14

### Patch Changes

- afd1b66: chore: bump packages version
- afd1b66: bump: package version 2

## 1.5.13

### Patch Changes

- 5317d6a: chore: bump @dojoengine/predeployed-connector version

## 1.5.12

### Patch Changes

- 5143b5e: fix: torii-wasm import from node-worker

## 1.5.11

### Patch Changes

- 1296ec1: fix: publish offchain messages

## 1.5.10

### Patch Changes

- 04cd161: chore: bump dojo.c to get latest publishMessage endpoint

## 1.5.9

### Patch Changes

- c8037ed: fix: removed \_hashedKey from subscription callback
- 1bbe42e: feat: add subscribeToken endpoint

## 1.5.8

### Patch Changes

- fd36752: fix: use starknet.shortstring.encodeShortString instead of torii-wasm equivalent

## 1.5.7

### Patch Changes

- e08880e: chore: bump dojo.c + fix node worker

## 1.5.6

### Patch Changes

- a36e92a: fix: recs update single component

## 1.5.5

### Patch Changes

- e1be67a: fix: recs getEventMessages looping

## 1.5.4

### Patch Changes

- f846b79: fix: pagination missing next_cursor

## 1.5.3

### Patch Changes

- recs

## 1.5.2

### Patch Changes

- updates

## 1.5.1

### Patch Changes

- 97aaa22: feat: Support torii pagination

## 1.5.0

### Minor Changes

- cb2f3ee: chore: bump dojo 1.5

## 1.4.4

### Patch Changes

- a4ed667: feat: torii-wasm nodejs support

## 1.4.3

### Patch Changes

- 624523b: feat: reset store

## 1.4.2

### Patch Changes

- ed933bc: feat: export intoEntityKeysClause
- 84585bc: fix: remove torii-client from core

## 1.4.1

### Patch Changes

- c3fd338: fix: bump all packages

## 1.4.0

### Minor Changes

- d908fdf: chore: bump dojo 1.4.0

## 1.3.1

### Patch Changes

- ff6eb12: chore: bump dojo 1.3.1

## 1.3.0

### Minor Changes

- 5e23a94: chore: bump upgrade to dojo 1.3

## 1.2.7

### Patch Changes

- 811ae57: fix: cairo option and enum ignore in zustand merge

## 1.2.6

### Patch Changes

- 612da82: feat: add react hook to get predeployed accounts
- 7f48d18: fix: generateTypedData optimization

## 1.2.5

### Patch Changes

- fbc6a2e: fix: changing release workflow
- 691f1a3: fix: udpate package name + add build cache

## 1.2.4

### Patch Changes

- 28398be: fix: recs convertValues do not set to null

## 1.2.3

### Patch Changes

- b94f26d: fix: recs component matching

## 1.2.2

### Patch Changes

- d8a9b0d: fix: recs `setEntities` now updates component if component exists

## 1.2.1

### Patch Changes

- 1cd88c8: refactor sdk useEntityQuery,useEventQuery,useHistoricalEventsQuery
- e2a4ea5: fix: zustand updateEntity and mergeEntities deeply merge objects

## 1.2.0

### Minor Changes

- a9ccef3: feat: add reusable sdk react hooks

## 1.1.3

### Patch Changes

- a4fc8e4: fix: predeployed warnings

## 1.1.2

### Patch Changes

- 9af1969: chore: bump dojo v1.2.1. Add token_ids to sdk

## 1.1.1

### Patch Changes

- ded4be2: feat: remove field order and bump torii-client

## 1.1.0

### Minor Changes

- 27d0342: Default to ToriiQueryBuilder for queries with Clause

### Patch Changes

- 395e450: fix: createStore now fit to either vanilla or react store
- d030ace: fix: Add nested query test to match book + syntactic sugar

## 1.0.13

### Patch Changes

- 4fa350a: fix: createDojoStore have now proper types
- 257d02a: Fix historical events ordering

## 1.0.12

### Patch Changes

- b4dc1e2: parseEntities now returns Array<ParsedEntity<T>> instead of Record<string, ParsedEntity<T>>

## 1.0.11

### Patch Changes

- 5f335d0: Added experimental ToriiQueryBuilder and ClauseBuilder to be closer to how we should query ECS through torii

## 1.0.10

### Patch Changes

- 84dd776: Updated packages to latest dojo version // accept and convert array by @rsodre // add missing params for query and subscription by @rsodre // update starknet-core-version by @rsodre
- 42ab8cf: Add @dojoengine/sdk/state @dojoengine/sdk/react @dojoengine/sdk/sql // Moves hooks to sdk // Update examples
- ac645ac: Catch error when unsuccessfully fetch 'dev_predeployedAccounts' endpoint

## 1.0.9

### Patch Changes

- 987fcb6: change from lerna to changeset

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.8](https://github.com/dojoengine/sdk/compare/v1.0.7...v1.0.8) (2025-01-06)

### Bug Fixes

- build-examples ([ffc30b4](https://github.com/dojoengine/sdk/commit/ffc30b41671fd29c7e230635ab6c254c198f6c60))

### Features

- fix react-sdk example + predeployed connector + historical events ([50cc19e](https://github.com/dojoengine/sdk/commit/50cc19ea944c5712e5df6062e4b73e472c21e877))
- upgrade starknet peerDependency ([9c60112](https://github.com/dojoengine/sdk/commit/9c6011275c7213d68175a0dd51275caae55e2e61))

## [1.0.7](https://github.com/dojoengine/sdk/compare/v1.0.6...v1.0.7) (2024-12-27)

**Note:** Version bump only for package @dojoengine/predeployed-connector

## [1.0.6](https://github.com/dojoengine/sdk/compare/v1.0.5...v1.0.6) (2024-12-23)

**Note:** Version bump only for package @dojoengine/predeployed-connector

## [1.0.4](https://github.com/dojoengine/sdk/compare/v1.0.4-alpha.3.1.2...v1.0.4) (2024-12-21)

### Bug Fixes

- predeployed-connector package build ([993ce9a](https://github.com/dojoengine/sdk/commit/993ce9a4777f1f6e32dc1de435416bef8b9c0a0e))

### Features

- parseEntities, cairocustomenum support ([60b46c6](https://github.com/dojoengine/sdk/commit/60b46c672fc2bfd51a9eb3aa5a51cb834c828ce5))
- pass with no test predeployed connector ([e118dcd](https://github.com/dojoengine/sdk/commit/e118dcd7ea4f0c397dc3db8d20b40b0b3d93cb52))

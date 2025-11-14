# Change Log

## 1.8.8

### Patch Changes

- Updated dependencies [ec30bc3]
  - @dojoengine/state@1.8.4

## 1.8.7

### Patch Changes

- Updated dependencies [c0d2ae2]
  - @dojoengine/core@1.8.5
  - @dojoengine/grpc@1.8.4
  - @dojoengine/state@1.8.3

## 1.8.6

### Patch Changes

- 1bf346b: fix: update @dojoengine/core package version
- Updated dependencies [1bf346b]
  - @dojoengine/grpc@1.8.4
  - @dojoengine/state@1.8.3
  - @dojoengine/utils@1.8.3

## 1.8.5

### Patch Changes

- Updated dependencies [79ba4c0]
  - @dojoengine/core@1.8.4
  - @dojoengine/grpc@1.8.3
  - @dojoengine/state@1.8.2

## 1.8.4

### Patch Changes

- Updated dependencies [2a05fd2]
  - @dojoengine/core@1.8.3
  - @dojoengine/grpc@1.8.3
  - @dojoengine/state@1.8.2

## 1.8.3

### Patch Changes

- 2ea2531: chore(torii-wasm): update torii version
- Updated dependencies [2ea2531]
  - @dojoengine/torii-wasm@1.8.2
  - @dojoengine/grpc@1.8.3
  - @dojoengine/core@1.8.2
  - @dojoengine/state@1.8.2
  - @dojoengine/torii-client@1.8.2
  - @dojoengine/utils@1.8.2

## 1.8.2

### Patch Changes

- 387ee18: fix(grpc): addAddressPadding on worldAddress
- Updated dependencies [387ee18]
  - @dojoengine/grpc@1.8.2

## 1.8.1

### Patch Changes

- d93f585: chore: bump torii to 1.8.3
- Updated dependencies [d93f585]
  - @dojoengine/core@1.8.1
  - @dojoengine/grpc@1.8.1
  - @dojoengine/state@1.8.1
  - @dojoengine/torii-client@1.8.1
  - @dojoengine/torii-wasm@1.8.1
  - @dojoengine/utils@1.8.1

## 1.8.0

### Minor Changes

- 23457a3: chore: bump torii to 1.8.2

### Patch Changes

- Updated dependencies [23457a3]
  - @dojoengine/torii-wasm@1.8.0
  - @dojoengine/grpc@1.8.0
  - @dojoengine/core@1.8.0
  - @dojoengine/state@1.8.0
  - @dojoengine/torii-client@1.8.0
  - @dojoengine/utils@1.8.0

## 1.7.6

### Patch Changes

- 29c10f7: chore: bump torii 1.7.2
- Updated dependencies [29c10f7]
  - @dojoengine/core@1.7.4
  - @dojoengine/grpc@1.7.5
  - @dojoengine/state@1.7.3
  - @dojoengine/torii-client@1.7.3
  - @dojoengine/torii-wasm@1.7.3
  - @dojoengine/utils@1.7.2

## 1.7.5

### Patch Changes

- Updated dependencies [10f97fe]
  - @dojoengine/core@1.7.3
  - @dojoengine/grpc@1.7.4
  - @dojoengine/state@1.7.2

## 1.7.4

### Patch Changes

- Updated dependencies [485ebf1]
- Updated dependencies [485ebf1]
  - @dojoengine/grpc@1.7.4

## 1.7.3

### Patch Changes

- Updated dependencies [17df0bb]
- Updated dependencies [8597cd4]
  - @dojoengine/core@1.7.2
  - @dojoengine/grpc@1.7.3
  - @dojoengine/state@1.7.2

## 1.7.2

### Patch Changes

- 683da96: chore: update torii to 1.7.0
- Updated dependencies [683da96]
  - @dojoengine/torii-wasm@1.7.2
  - @dojoengine/core@1.7.1
  - @dojoengine/grpc@1.7.2
  - @dojoengine/state@1.7.2
  - @dojoengine/torii-client@1.7.2
  - @dojoengine/utils@1.7.1

## 1.7.1

### Patch Changes

- 97a476a: chore: bump torii to rc-7
- Updated dependencies [1a00ae4]
- Updated dependencies [97a476a]
  - @dojoengine/torii-wasm@1.7.1
  - @dojoengine/grpc@1.7.1
  - @dojoengine/torii-client@1.7.1
  - @dojoengine/state@1.7.1

## 1.7.1-preview.0

### Patch Changes

- Updated dependencies [4060bc6]
  - @dojoengine/torii-wasm@1.7.1-preview.0
  - @dojoengine/grpc@1.7.1-preview.0
  - @dojoengine/torii-client@1.7.1-preview.0
  - @dojoengine/state@1.7.1-preview.0

## 1.7.0

### Minor Changes

- 48f93d8: chore: bump dojo.c version
- 48f93d8: chore: bump minor version
- 48f93d8: fix(sdk): primitive parsing
- 48f93d8: chore: bump starknet versions
- 48f93d8: fix(sdk): ensure entityIds are properly padded

### Patch Changes

- 48f93d8: fix: ensure entity IDs are consistently padded across SDK

  - Updated `getEntityIdFromKeys` to return properly padded entity IDs (66 characters: 0x + 64 hex)
  - This fixes the issue where `waitForEntityChange` would return `undefined` when using entity IDs from `getEntityIdFromKeys`
  - Entity IDs are now consistently padded whether they come from Torii or are generated manually
  - Resolves issues #484 and #485

- Updated dependencies [48f93d8]
- Updated dependencies [48f93d8]
- Updated dependencies [48f93d8]
- Updated dependencies [48f93d8]
- Updated dependencies [48f93d8]
- Updated dependencies [48f93d8]
  - @dojoengine/utils@1.7.0
  - @dojoengine/torii-wasm@1.7.0
  - @dojoengine/core@1.7.0
  - @dojoengine/grpc@1.7.0
  - @dojoengine/state@1.7.0
  - @dojoengine/torii-client@1.7.0

## 1.7.0-preview.5

### Minor Changes

- 1a580dd: chore: bump minor version

### Patch Changes

- Updated dependencies [1a580dd]
  - @dojoengine/torii-client@1.7.0-preview.4
  - @dojoengine/torii-wasm@1.7.0-preview.4
  - @dojoengine/utils@1.7.0-preview.5
  - @dojoengine/core@1.7.0-preview.4

## 1.7.0-preview.4

### Patch Changes

- c4b2fc0: fix: ensure entity IDs are consistently padded across SDK

  - Updated `getEntityIdFromKeys` to return properly padded entity IDs (66 characters: 0x + 64 hex)
  - This fixes the issue where `waitForEntityChange` would return `undefined` when using entity IDs from `getEntityIdFromKeys`
  - Entity IDs are now consistently padded whether they come from Torii or are generated manually
  - Resolves issues #484 and #485

- Updated dependencies [c4b2fc0]
  - @dojoengine/utils@1.7.0-preview.4

## 1.7.0-preview.3

### Minor Changes

- 10314f1: fix(sdk): ensure entityIds are properly padded

### Patch Changes

- Updated dependencies [10314f1]
  - @dojoengine/torii-client@1.7.0-preview.3
  - @dojoengine/torii-wasm@1.7.0-preview.3
  - @dojoengine/utils@1.7.0-preview.3
  - @dojoengine/core@1.7.0-preview.3

## 1.7.0-preview.2

### Minor Changes

- c9a750e: fix(sdk): primitive parsing

### Patch Changes

- Updated dependencies [c9a750e]
  - @dojoengine/torii-client@1.7.0-preview.2
  - @dojoengine/torii-wasm@1.7.0-preview.2
  - @dojoengine/utils@1.7.0-preview.2
  - @dojoengine/core@1.7.0-preview.2

## 1.7.0-preview.1

### Minor Changes

- 4790942: chore: bump dojo.c version

### Patch Changes

- Updated dependencies [4790942]
  - @dojoengine/torii-wasm@1.7.0-preview.1
  - @dojoengine/core@1.7.0-preview.1
  - @dojoengine/torii-client@1.7.0-preview.1
  - @dojoengine/utils@1.7.0-preview.1

## 1.7.0-preview.0

### Minor Changes

- 88cac6e: chore: bump starknet versions

### Patch Changes

- Updated dependencies [88cac6e]
  - @dojoengine/torii-wasm@1.7.0-preview.0
  - @dojoengine/core@1.7.0-preview.0
  - @dojoengine/torii-client@1.7.0-preview.0
  - @dojoengine/utils@1.7.0-preview.0

## 1.6.8

### Patch Changes

- 4186e62: feat(sdk): enable grpc client
- 4186e62: chore: bump package
- Updated dependencies [4186e62]
- Updated dependencies [4186e62]
- Updated dependencies [4186e62]
- Updated dependencies [4186e62]
- Updated dependencies [4186e62]
  - @dojoengine/torii-client@1.6.5
  - @dojoengine/torii-wasm@1.6.5
  - @dojoengine/state@1.6.5
  - @dojoengine/grpc@1.6.4

## 1.6.8-alpha.3

### Patch Changes

- Updated dependencies [a8f2e5e]
- Updated dependencies [41a1ee0]
  - @dojoengine/torii-client@1.6.5-alpha.2
  - @dojoengine/torii-wasm@1.6.5-alpha.2
  - @dojoengine/state@1.6.5-alpha.2
  - @dojoengine/grpc@1.6.4

## 1.6.8-alpha.2

### Patch Changes

- Updated dependencies [fdb2351]
- Updated dependencies [c989c75]
  - @dojoengine/torii-client@1.6.5-alpha.1
  - @dojoengine/torii-wasm@1.6.5-alpha.1
  - @dojoengine/state@1.6.5-alpha.1
  - @dojoengine/grpc@1.6.4

## 1.6.8-alpha.1

### Patch Changes

- da0cae8: chore: bump package
- Updated dependencies [da0cae8]
  - @dojoengine/torii-client@1.6.5-alpha.0
  - @dojoengine/torii-wasm@1.6.5-alpha.0
  - @dojoengine/state@1.6.5-alpha.0
  - @dojoengine/grpc@1.6.4

## 1.6.8-alpha.0

### Patch Changes

- 248a4f4: feat(sdk): enable grpc client

## 1.6.7

### Patch Changes

- c82e607: fix(sdk): state dependency issue
- a3091a6: chore: fix publish workspace package version
- Updated dependencies [d791e06]
- Updated dependencies [c82e607]
- Updated dependencies [a3091a6]
  - @dojoengine/grpc@1.6.4
  - @dojoengine/state@1.6.4
  - @dojoengine/core@1.6.4
  - @dojoengine/torii-client@1.6.4
  - @dojoengine/torii-wasm@1.6.4
  - @dojoengine/utils@1.6.4

## 1.6.6

### Patch Changes

- fefe27a: fix(sdk): re-export internal package

## 1.6.5

### Patch Changes

- Updated dependencies [521d4ca]
  - @dojoengine/grpc@1.6.3

## 1.6.4

### Patch Changes

- b408e6f: fix: bundle @dojoengine/internal with public packages
- Updated dependencies [b408e6f]
  - @dojoengine/core@1.6.3
  - @dojoengine/grpc@0.0.2
  - @dojoengine/torii-client@1.6.3
  - @dojoengine/torii-wasm@1.6.3
  - @dojoengine/utils@1.6.3

## 1.6.3

### Patch Changes

- 3a4f6c6: fix: build issues
- 04fe923: fix: deploy to npm
- Updated dependencies [3a4f6c6]
- Updated dependencies [04fe923]
  - @dojoengine/core@1.6.2
  - @dojoengine/grpc@0.0.1
  - @dojoengine/internal@1.6.3
  - @dojoengine/torii-client@1.6.2
  - @dojoengine/torii-wasm@1.6.2
  - @dojoengine/utils@1.6.2

## 1.6.2

### Patch Changes

- 026bcb9: fix: mark packages as private
- Updated dependencies [026bcb9]
  - @dojoengine/core@1.6.1
  - @dojoengine/torii-client@1.6.1
  - @dojoengine/torii-wasm@1.6.1
  - @dojoengine/utils@1.6.1
  - @dojoengine/internal@1.6.2
  - @dojoengine/grpc@0.0.0

## 1.6.1

### Patch Changes

- 2f650f8: fix(sdk): fix event subscriptions and token balance
- Updated dependencies [2f650f8]
  - @dojoengine/internal@1.6.1
  - @dojoengine/grpc@0.0.0

## 1.6.0

### Minor Changes

- 69dcb43: feat: add zustand historical entities
- 69dcb43: chore: bump starknetjs version

### Patch Changes

- 69dcb43: fix: github workflow fix
- 69dcb43: chore: bump starknet.js to 7.6.2
- 69dcb43: fix: zustand historical state hook
- 69dcb43: chore: bump dojo.c
- 30b6165: fix: add sendSignedMessageBatch util
- 69dcb43: chore: bump dojo & dojo-starter
- 69dcb43: chore: bump dojo.c
- 69dcb43: fix: update release process
- 69dcb43: fix(sdk): deduplicate historical entities
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [30b6165]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
- Updated dependencies [69dcb43]
  - @dojoengine/torii-client@1.6.0
  - @dojoengine/torii-wasm@1.6.0
  - @dojoengine/utils@1.6.0
  - @dojoengine/core@1.6.0

## 1.6.0-beta.7

### Patch Changes

- b4a3c92: fix(sdk): deduplicate historical entities

## 1.6.0-beta.6

### Patch Changes

- dba78bb: fix: zustand historical state hook

## 1.6.0-beta.5

### Minor Changes

- 736a46b: feat: add zustand historical entities

## 1.6.0-beta.4

### Patch Changes

- ca4814b: chore: bump dojo.c
- Updated dependencies [ca4814b]
  - @dojoengine/torii-client@1.6.0-beta.4
  - @dojoengine/torii-wasm@1.6.0-beta.4
  - @dojoengine/utils@1.6.0-beta.4
  - @dojoengine/core@1.6.0-beta.4

## 1.6.0-beta.3

### Patch Changes

- 9e163f4: chore: bump starknet.js to 7.6.2
- Updated dependencies [9e163f4]
- Updated dependencies [d8f7035]
  - @dojoengine/torii-client@1.6.0-beta.3
  - @dojoengine/torii-wasm@1.6.0-beta.3
  - @dojoengine/utils@1.6.0-beta.3
  - @dojoengine/core@1.6.0-beta.3

## 1.6.0-beta.2

### Patch Changes

- 19c9411: fix: github workflow fix
- Updated dependencies [19c9411]
  - @dojoengine/torii-client@1.6.0-beta.2
  - @dojoengine/torii-wasm@1.6.0-beta.2
  - @dojoengine/utils@1.6.0-beta.2
  - @dojoengine/core@1.6.0-beta.2

## 1.6.0-beta.1

### Patch Changes

- ef76fca: fix: update release process
- Updated dependencies [ef76fca]
  - @dojoengine/torii-client@1.6.0-beta.1
  - @dojoengine/torii-wasm@1.6.0-beta.1
  - @dojoengine/utils@1.6.0-beta.1
  - @dojoengine/core@1.6.0-beta.1

## 1.6.0-beta.0

### Minor Changes

- b9817aa: chore: bump starknetjs version

### Patch Changes

- 30b6165: fix: add sendSignedMessageBatch util
- Updated dependencies [b9817aa]
- Updated dependencies [30b6165]
  - @dojoengine/core@1.6.0-beta.0
  - @dojoengine/torii-client@1.6.0-beta.0
  - @dojoengine/torii-wasm@1.6.0-beta.0
  - @dojoengine/utils@1.6.0-beta.0

## 1.5.18

### Patch Changes

- 7d93332: fix: add sendSignedMessageBatch util
- Updated dependencies [7d93332]
  - @dojoengine/core@1.5.17
  - @dojoengine/torii-client@1.5.16
  - @dojoengine/torii-wasm@1.5.16
  - @dojoengine/utils@1.5.16

## 1.5.17

### Patch Changes

- 5b32060: fix: useTokens
- Updated dependencies [5b32060]
  - @dojoengine/core@1.5.16
  - @dojoengine/torii-client@1.5.15
  - @dojoengine/torii-wasm@1.5.15
  - @dojoengine/utils@1.5.15

## 1.5.16

### Patch Changes

- 9ee999e: fix: remove promise.all from batch
- Updated dependencies [9ee999e]
  - @dojoengine/core@1.5.15
  - @dojoengine/torii-client@1.5.14
  - @dojoengine/torii-wasm@1.5.14
  - @dojoengine/utils@1.5.14

## 1.5.15

### Patch Changes

- afd1b66: chore: bump packages version
- afd1b66: bump: package version 2
- Updated dependencies [afd1b66]
- Updated dependencies [afd1b66]
  - @dojoengine/core@1.5.14
  - @dojoengine/torii-client@1.5.13
  - @dojoengine/torii-wasm@1.5.13
  - @dojoengine/utils@1.5.13

## 1.5.14

### Patch Changes

- Updated dependencies [4a1bb53]
  - @dojoengine/core@1.5.13

## 1.5.13

### Patch Changes

- ec746da: feat: add hashedkeysclause to clause builder

## 1.5.12

### Patch Changes

- 5143b5e: fix: torii-wasm import from node-worker
- Updated dependencies [5143b5e]
  - @dojoengine/torii-wasm@1.5.12
  - @dojoengine/core@1.5.12
  - @dojoengine/torii-client@1.5.12
  - @dojoengine/utils@1.5.12

## 1.5.11

### Patch Changes

- 1296ec1: fix: publish offchain messages
- Updated dependencies [1296ec1]
  - @dojoengine/torii-wasm@1.5.11
  - @dojoengine/core@1.5.11
  - @dojoengine/torii-client@1.5.11
  - @dojoengine/utils@1.5.11

## 1.5.10

### Patch Changes

- 04cd161: chore: bump dojo.c to get latest publishMessage endpoint
- Updated dependencies [04cd161]
  - @dojoengine/torii-wasm@1.5.10
  - @dojoengine/core@1.5.10
  - @dojoengine/torii-client@1.5.10
  - @dojoengine/utils@1.5.10

## 1.5.9

### Patch Changes

- c8037ed: fix: removed \_hashedKey from subscription callback
- 1bbe42e: feat: add subscribeToken endpoint
- Updated dependencies [c8037ed]
- Updated dependencies [1bbe42e]
  - @dojoengine/core@1.5.9
  - @dojoengine/torii-client@1.5.9
  - @dojoengine/torii-wasm@1.5.9
  - @dojoengine/utils@1.5.9

## 1.5.8

### Patch Changes

- fd36752: fix: use starknet.shortstring.encodeShortString instead of torii-wasm equivalent
- Updated dependencies [fd36752]
  - @dojoengine/core@1.5.8
  - @dojoengine/torii-client@1.5.8
  - @dojoengine/torii-wasm@1.5.8
  - @dojoengine/utils@1.5.8

## 1.5.7

### Patch Changes

- e08880e: chore: bump dojo.c + fix node worker
- Updated dependencies [e08880e]
  - @dojoengine/torii-wasm@1.5.7
  - @dojoengine/core@1.5.7
  - @dojoengine/torii-client@1.5.7
  - @dojoengine/utils@1.5.7

## 1.5.6

### Patch Changes

- a36e92a: fix: recs update single component
- Updated dependencies [a36e92a]
  - @dojoengine/core@1.5.6
  - @dojoengine/torii-client@1.5.6
  - @dojoengine/torii-wasm@1.5.6
  - @dojoengine/utils@1.5.6

## 1.5.5

### Patch Changes

- e1be67a: fix: recs getEventMessages looping
- Updated dependencies [e1be67a]
  - @dojoengine/core@1.5.5
  - @dojoengine/torii-client@1.5.5
  - @dojoengine/torii-wasm@1.5.5
  - @dojoengine/utils@1.5.5

## 1.5.4

### Patch Changes

- f846b79: fix: pagination missing next_cursor
- Updated dependencies [f846b79]
  - @dojoengine/core@1.5.4
  - @dojoengine/torii-client@1.5.4
  - @dojoengine/torii-wasm@1.5.4
  - @dojoengine/utils@1.5.4

## 1.5.3

### Patch Changes

- recs
- Updated dependencies
  - @dojoengine/core@1.5.3
  - @dojoengine/torii-client@1.5.3
  - @dojoengine/torii-wasm@1.5.3
  - @dojoengine/utils@1.5.3

## 1.5.2

### Patch Changes

- updates
- Updated dependencies
  - @dojoengine/core@1.5.2
  - @dojoengine/torii-client@1.5.2
  - @dojoengine/torii-wasm@1.5.2
  - @dojoengine/utils@1.5.2

## 1.5.1

### Patch Changes

- 97aaa22: feat: Support torii pagination
- Updated dependencies [97aaa22]
  - @dojoengine/torii-wasm@1.5.1
  - @dojoengine/core@1.5.1
  - @dojoengine/torii-client@1.5.1
  - @dojoengine/utils@1.5.1

## 1.5.0

### Minor Changes

- cb2f3ee: chore: bump dojo 1.5

### Patch Changes

- Updated dependencies [cb2f3ee]
  - @dojoengine/torii-wasm@1.5.0
  - @dojoengine/core@1.5.0
  - @dojoengine/torii-client@1.5.0
  - @dojoengine/utils@1.5.0

## 1.4.4

### Patch Changes

- a4ed667: feat: torii-wasm nodejs support
- Updated dependencies [a4ed667]
  - @dojoengine/torii-wasm@1.4.4
  - @dojoengine/core@1.4.4
  - @dojoengine/torii-client@1.4.4
  - @dojoengine/utils@1.4.4

## 1.4.3

### Patch Changes

- 624523b: feat: reset store
- Updated dependencies [624523b]
  - @dojoengine/core@1.4.3
  - @dojoengine/torii-client@1.4.3
  - @dojoengine/utils@1.4.3

## 1.4.2

### Patch Changes

- ed933bc: feat: export intoEntityKeysClause
- 84585bc: fix: remove torii-client from core
- Updated dependencies [ed933bc]
- Updated dependencies [84585bc]
  - @dojoengine/core@1.4.2
  - @dojoengine/torii-client@1.4.2
  - @dojoengine/utils@1.4.2

## 1.4.1

### Patch Changes

- c3fd338: fix: bump all packages
- Updated dependencies [c3fd338]
  - @dojoengine/core@1.4.1
  - @dojoengine/torii-client@1.4.1
  - @dojoengine/utils@1.4.1

## 1.4.0

### Minor Changes

- d908fdf: chore: bump dojo 1.4.0

### Patch Changes

- a7a4ee6: feat: add torii tokens hooks + related example
- Updated dependencies [d908fdf]
  - @dojoengine/core@1.4.0
  - @dojoengine/torii-client@1.4.0
  - @dojoengine/utils@1.4.0

## 1.3.1

### Patch Changes

- ff6eb12: chore: bump dojo 1.3.1
- 0157fe1: feat: add way to create specific types to query torii
- Updated dependencies [ff6eb12]
  - @dojoengine/torii-client@1.3.1
  - @dojoengine/utils@1.3.1
  - @dojoengine/core@1.3.1

## 1.3.0

### Minor Changes

- 5e23a94: chore: bump upgrade to dojo 1.3

### Patch Changes

- Updated dependencies [5e23a94]
  - @dojoengine/core@1.3.0
  - @dojoengine/torii-client@1.3.0
  - @dojoengine/utils@1.3.0

## 1.2.7

### Patch Changes

- 811ae57: fix: cairo option and enum ignore in zustand merge
- Updated dependencies [811ae57]
  - @dojoengine/utils@1.2.7
  - @dojoengine/core@1.2.7
  - @dojoengine/torii-client@1.2.7

## 1.2.6

### Patch Changes

- 7f48d18: fix: generateTypedData optimization
- aa70cc7: fix: argument order passed to dojo.c
- Updated dependencies [7f48d18]
  - @dojoengine/core@1.2.6
  - @dojoengine/torii-client@1.2.6
  - @dojoengine/utils@1.2.6

## 1.2.5

### Patch Changes

- fbc6a2e: fix: changing release workflow
- 691f1a3: fix: udpate package name + add build cache
- Updated dependencies [fbc6a2e]
- Updated dependencies [691f1a3]
  - @dojoengine/core@1.2.5
  - @dojoengine/torii-client@1.2.5
  - @dojoengine/utils@1.2.5

## 1.2.4

### Patch Changes

- 28398be: fix: recs convertValues do not set to null
- Updated dependencies [28398be]
  - @dojoengine/core@1.2.4
  - @dojoengine/torii-client@1.2.4
  - @dojoengine/utils@1.2.4

## 1.2.3

### Patch Changes

- b94f26d: fix: recs component matching
- Updated dependencies [b94f26d]
  - @dojoengine/core@1.2.3
  - @dojoengine/torii-client@1.2.3
  - @dojoengine/utils@1.2.3

## 1.2.2

### Patch Changes

- d8a9b0d: fix: recs `setEntities` now updates component if component exists
- Updated dependencies [d8a9b0d]
  - @dojoengine/core@1.2.2
  - @dojoengine/torii-client@1.2.2
  - @dojoengine/utils@1.2.2

## 1.2.1

### Patch Changes

- 1cd88c8: refactor sdk useEntityQuery,useEventQuery,useHistoricalEventsQuery
- e2a4ea5: fix: zustand updateEntity and mergeEntities deeply merge objects
- Updated dependencies [1cd88c8]
- Updated dependencies [e2a4ea5]
  - @dojoengine/core@1.2.1
  - @dojoengine/torii-client@1.2.1
  - @dojoengine/utils@1.2.1

## 1.2.0

### Minor Changes

- a9ccef3: feat: add reusable sdk react hooks

### Patch Changes

- Updated dependencies [a9ccef3]
  - @dojoengine/core@1.2.0
  - @dojoengine/torii-client@1.2.0
  - @dojoengine/utils@1.2.0

## 1.1.3

### Patch Changes

- a4fc8e4: fix: predeployed warnings
- Updated dependencies [a4fc8e4]
  - @dojoengine/core@1.1.3
  - @dojoengine/torii-client@1.1.3

## 1.1.2

### Patch Changes

- 9af1969: chore: bump dojo v1.2.1. Add token_ids to sdk
- Updated dependencies [9af1969]
  - @dojoengine/core@1.1.2
  - @dojoengine/torii-client@1.1.2

## 1.1.1

### Patch Changes

- ded4be2: feat: remove field order and bump torii-client
- Updated dependencies [ded4be2]
  - @dojoengine/core@1.1.1
  - @dojoengine/torii-client@1.1.1

## 1.1.0

### Minor Changes

- 27d0342: Default to ToriiQueryBuilder for queries with Clause

### Patch Changes

- 395e450: fix: createStore now fit to either vanilla or react store
- d030ace: fix: Add nested query test to match book + syntactic sugar
- Updated dependencies [395e450]
- Updated dependencies [d030ace]
- Updated dependencies [27d0342]
  - @dojoengine/core@1.1.0
  - @dojoengine/torii-client@1.1.0

## 1.0.13

### Patch Changes

- 4fa350a: fix: createDojoStore have now proper types
- 257d02a: Fix historical events ordering
- Updated dependencies [4fa350a]
- Updated dependencies [257d02a]
  - @dojoengine/core@1.0.13
  - @dojoengine/torii-client@1.0.13

## 1.0.12

### Patch Changes

- b4dc1e2: parseEntities now returns Array<ParsedEntity<T>> instead of Record<string, ParsedEntity<T>>
- Updated dependencies [b4dc1e2]
  - @dojoengine/core@1.0.12
  - @dojoengine/torii-client@1.0.12

## 1.0.11

### Patch Changes

- 5f335d0: Added experimental ToriiQueryBuilder and ClauseBuilder to be closer to how we should query ECS through torii
- Updated dependencies [5f335d0]
  - @dojoengine/core@1.0.11
  - @dojoengine/torii-client@1.0.11

## 1.0.10

### Patch Changes

- 84dd776: Updated packages to latest dojo version // accept and convert array by @rsodre // add missing params for query and subscription by @rsodre // update starknet-core-version by @rsodre
- 42ab8cf: Add @dojoengine/sdk/state @dojoengine/sdk/react @dojoengine/sdk/sql // Moves hooks to sdk // Update examples
- Updated dependencies [84dd776]
- Updated dependencies [42ab8cf]
  - @dojoengine/core@1.0.10
  - @dojoengine/torii-client@1.0.10

## 1.0.9

### Patch Changes

- 987fcb6: change from lerna to changeset
- Updated dependencies [987fcb6]
  - @dojoengine/torii-client@1.0.9

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.8](https://github.com/dojoengine/sdk/compare/v1.0.7...v1.0.8) (2025-01-06)

### Bug Fixes

- added historical option for event getters ([ff2adef](https://github.com/dojoengine/sdk/commit/ff2adeff1c628be8a8c9966cee55c9270f26a8b9))
- build-examples ([ffc30b4](https://github.com/dojoengine/sdk/commit/ffc30b41671fd29c7e230635ab6c254c198f6c60))
- support in operator ([b9cb6be](https://github.com/dojoengine/sdk/commit/b9cb6be14e56750e0aefdd42f6b35a1197761710))
- typedoc ([5d2c518](https://github.com/dojoengine/sdk/commit/5d2c518f1dcb1013af03364c23ed74de3f13c352))
- typedoc ci ([a7cb74b](https://github.com/dojoengine/sdk/commit/a7cb74b1b62ee09b08fb9815c08a668955654f3f))

### Features

- fix react-sdk example + predeployed connector + historical events ([50cc19e](https://github.com/dojoengine/sdk/commit/50cc19ea944c5712e5df6062e4b73e472c21e877))
- upgrade starknet peerDependency ([9c60112](https://github.com/dojoengine/sdk/commit/9c6011275c7213d68175a0dd51275caae55e2e61))

## [1.0.7](https://github.com/dojoengine/sdk/compare/v1.0.6...v1.0.7) (2024-12-27)

### Features

- bump dojo v1.0.9 ([32db06c](https://github.com/dojoengine/sdk/commit/32db06cf32348b6b2d150e86817326f9fb35ce45))

## [1.0.6](https://github.com/dojoengine/sdk/compare/v1.0.5...v1.0.6) (2024-12-23)

**Note:** Version bump only for package @dojoengine/sdk

## [1.0.4](https://github.com/dojoengine/sdk/compare/v1.0.4-alpha.3.1.2...v1.0.4) (2024-12-21)

### Features

- parseEntities, cairocustomenum support ([60b46c6](https://github.com/dojoengine/sdk/commit/60b46c672fc2bfd51a9eb3aa5a51cb834c828ce5))

## [1.0.3](https://github.com/dojoengine/sdk/compare/v1.0.3-alpha.2...v1.0.3) (2024-12-14)

### Features

- add order_by and entity_models to sdk ([0c9cf79](https://github.com/dojoengine/sdk/commit/0c9cf7913bc5b50bd907f56f3c60e169ef43ecce))
- upgrade to torii v1.0.7 ([5966fcc](https://github.com/dojoengine/sdk/commit/5966fcc072b02ec49bba4770031bc4fd760ee14a))

## [1.0.2](https://github.com/dojoengine/sdk/compare/v1.0.1...v1.0.2) (2024-11-27)

### Bug Fixes

- release build issue with sdk + querybuilder type ([25d3363](https://github.com/dojoengine/sdk/commit/25d33639b7bc699d082d038b835c15da31c08783))

## [1.0.1](https://github.com/dojoengine/sdk/compare/v1.0.0...v1.0.1) (2024-11-26)

### Bug Fixes

- conditions to flatten clause ([f7297e8](https://github.com/dojoengine/sdk/commit/f7297e8b6bd739e04848c623d491b0ba8d112abb))
- sdk function params refac to object param ([822bdc4](https://github.com/dojoengine/sdk/commit/822bdc4161ca478ee8e3ff3e3121ee91fb260397))

### Features

- add examples ([e7715f6](https://github.com/dojoengine/sdk/commit/e7715f6bc503d2e0d90e08c5878028066fbb41f7))
- add querybuilder ([daf20b0](https://github.com/dojoengine/sdk/commit/daf20b039db6850a21b4d5ac51c8be7227ffd4a8))
- add torii tokens functions to dojo sdk ([be5c1a8](https://github.com/dojoengine/sdk/commit/be5c1a82f0467f2dc93ea9c9eab91fb580ac6e8f))

# [1.0.0](https://github.com/dojoengine/sdk/compare/v1.0.0-alpha.30...v1.0.0) (2024-11-11)

**Note:** Version bump only for package @dojoengine/sdk

# [1.0.0-alpha.30](https://github.com/dojoengine/sdk/compare/v1.0.0-alpha.29...v1.0.0-alpha.30) (2024-11-09)

### Features

- docs ([1bf47fa](https://github.com/dojoengine/sdk/commit/1bf47fae3afef5ab7f02f9ed288141e735ab2788))

# [1.0.0-alpha.29](https://github.com/dojoengine/sdk/compare/v1.0.0-alpha.28...v1.0.0-alpha.29) (2024-11-08)

**Note:** Version bump only for package @dojoengine/sdk

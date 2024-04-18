# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0-beta.0](https://github.com/dojoengine/dojo.js/compare/v0.6.122...v0.7.0-beta.0) (2024-04-18)

### Bug Fixes

-   added new burner manager functions to examples ([36000ef](https://github.com/dojoengine/dojo.js/commit/36000ef8f6498edf56b9bb666ed4a4af59b93ae7))
-   allow only prefundedAmount on create() options ([5f05a99](https://github.com/dojoengine/dojo.js/commit/5f05a991756ab0d074d93c577871e86f15ac5afa))
-   avoid burner deployment timeout when it is already deployed ([d884450](https://github.com/dojoengine/dojo.js/commit/d88445093d5c74c365436f5a0ef438fdc0e8366e))
-   build dependencies ([f3c85f6](https://github.com/dojoengine/dojo.js/commit/f3c85f69893f10d8ce46a029a3b62770b59755c3))
-   do not init() burner connector hooks when already initialized ([2147cb5](https://github.com/dojoengine/dojo.js/commit/2147cb56e19d83758fbd5528ec3cdc39b5e6d5de))
-   ensure CI build runs for PRs as well ([60f496e](https://github.com/dojoengine/dojo.js/commit/60f496ecea463bf09213f02129ecad13b98e4185))
-   fixed build ([4ab4a35](https://github.com/dojoengine/dojo.js/commit/4ab4a35729bc4f0b2541742e27dd46d0566c07b4))
-   merge ([f039441](https://github.com/dojoengine/dojo.js/commit/f0394415bab233040f45a0ff3959754ec69f799e))
-   missing .gitignore on vue-app ([bf8b548](https://github.com/dojoengine/dojo.js/commit/bf8b54851f97969f2745831a3e79fc24426ca53f))
-   missing prettier run, removed comment ([8057ecc](https://github.com/dojoengine/dojo.js/commit/8057ecc3c5d42ab3e68c7ed300c68f99f7a2e050))
-   moved keyDerivation.ts to utils ([78fe470](https://github.com/dojoengine/dojo.js/commit/78fe4706a12cd8c7843d874e18b0e1510b178f81))
-   outdated contractComponents on react-app ([f782585](https://github.com/dojoengine/dojo.js/commit/f782585406c15ecbdfd62ca0f04045b9eabe8c77))
-   regenerated pnpm-lock ([fbe5872](https://github.com/dojoengine/dojo.js/commit/fbe5872f9872b46691bfe6bf33f18c4ba542a3eb))
-   removed debug message ([0fa16c5](https://github.com/dojoengine/dojo.js/commit/0fa16c523ea103170c8e24d838583f18f1ebf76f))
-   **vue-app:** resolve missing field `relayUrl` issue and upgrade starknet version ([6bf9ccc](https://github.com/dojoengine/dojo.js/commit/6bf9ccc1774be5aeeba59bc1a822905daa034613))

### Features

-   added both development and master to target branches ([e1b1fc7](https://github.com/dojoengine/dojo.js/commit/e1b1fc7247974b13fb74afae1891947f615fb292))
-   added generateAddressFromSeed() to useBurnerManager ([ce80ad0](https://github.com/dojoengine/dojo.js/commit/ce80ad0bdb3843fba114929925bf38e99182b208))
-   added publish to setups ([ca882cc](https://github.com/dojoengine/dojo.js/commit/ca882cc2b9c19c8c2ca129ef41c514340d83f5f0))
-   added remove(address) to useBurnerManager ([bdce6e6](https://github.com/dojoengine/dojo.js/commit/bdce6e61269b16c2d09b3bd2a42e72918846b6ee))
-   allow null burner manager on useBurnerManager() ([e4deb87](https://github.com/dojoengine/dojo.js/commit/e4deb87ebfb8c09cc0d73882aef9c6cd27ee89de))
-   burner manager test for generateKeysAndAddress ([fee20ee](https://github.com/dojoengine/dojo.js/commit/fee20ee973da6085297466a0b712ddcc72f08103))
-   burner manager tests for list, get, select, deselect, remove, clear ([1c364c3](https://github.com/dojoengine/dojo.js/commit/1c364c33ef6af2f13d7ca1b0dcad833463ea12d6))
-   burnerManager can create() deterministic accounts ([3f20776](https://github.com/dojoengine/dojo.js/commit/3f2077688d3e3ccf646060aa6235b2d84f7ca3f9))
-   **burners:** add prefunded amount option ([3eef575](https://github.com/dojoengine/dojo.js/commit/3eef5752465c517bc584b6e77cf3aab728430516))
-   **burners:** add prefunded amount option ([3e07803](https://github.com/dojoengine/dojo.js/commit/3e078033ed77c4f7bb2317386566375f5f69e790))
-   **core:** typed data from model ([a0b9369](https://github.com/dojoengine/dojo.js/commit/a0b9369d007dd8545db3c9ecb9b95c98490f4c77))
-   deselect burner for guest support ([676f2a9](https://github.com/dojoengine/dojo.js/commit/676f2a924dfd0234a1e4a1f53f09a7090bcfc386))
-   deterministic burner key derivation ([c38b8c4](https://github.com/dojoengine/dojo.js/commit/c38b8c42d9419fcd0c8de592428adf4defe292bd))
-   expose dojo connectors id and name as SWO static functions ([f99754d](https://github.com/dojoengine/dojo.js/commit/f99754d8b09eacb9da4301901cebc676c79c5164))
-   expose torii client publish ([e616ac2](https://github.com/dojoengine/dojo.js/commit/e616ac21a346934967cbdb1a1536a0ad351e5104))
-   finalize typed data for model ([628e0da](https://github.com/dojoengine/dojo.js/commit/628e0daf1c69fb8d6147a56c588cd06944a78dc1))
-   improved burner tests ([a150da6](https://github.com/dojoengine/dojo.js/commit/a150da6c7334cda77ba38026ec0b0a9ea0356264))
-   only allow versioning from main and development branches ([86873c1](https://github.com/dojoengine/dojo.js/commit/86873c1a60a0d8a47bf30e99afc862585ffaf0cf))
-   optionally keep non deployed burners on init() ([854d180](https://github.com/dojoengine/dojo.js/commit/854d180dd58120a472983bd6db4cbbb2f243fb03))
-   publishes all packages to ensure consistent versions ([59e2628](https://github.com/dojoengine/dojo.js/commit/59e2628b5716c4a87aefed648536a9f4f6f752c4))
-   remove bun setup action ([a43e375](https://github.com/dojoengine/dojo.js/commit/a43e3751811bbda73dd1c6876c826ab28c98c7b7))
-   return master account and account index on list() ([d4391fb](https://github.com/dojoengine/dojo.js/commit/d4391fb94eef05cd2806895d93b725e39c34ceff))
-   return typeddata type & provide to publish ([9b4afbf](https://github.com/dojoengine/dojo.js/commit/9b4afbfc07b2b1a30a33c29cf0010e76c4461f4f))
-   store master account with burner ([89f601e](https://github.com/dojoengine/dojo.js/commit/89f601eb785318ba722f8e45c75c570265af6f8c))
-   **torii-wasm:** encode typed data ([7ae0c45](https://github.com/dojoengine/dojo.js/commit/7ae0c45ca4d5d6e9cd72ae5958270823effd25b0))
-   **torii-wasm:** publish message ([a381842](https://github.com/dojoengine/dojo.js/commit/a381842c35c7c484065d9232c9e8ea6e6aa77d94))
-   updated actions/checkout to latest version ([658acea](https://github.com/dojoengine/dojo.js/commit/658acea84458e9f80a6c1adec31c0e53b5b5507d))
-   wait for burner deployment before returning ([5a8738c](https://github.com/dojoengine/dojo.js/commit/5a8738c4cf77ffba52314d1bdf2a7727b52cee13))

# Changelog

All notable changes to Dojo.js will be documented in this file.

## 0.6.0 -0 3.04.2024

### Added

-   Increased batch size of entity query
-   Improved burner architecture
-   Updated Starknet js
-   Added relayUrl into ToriiClient ready for RTC
-   Remove bun and replaced with pnpm everywhere

### Changed

### Removed

### Fixed

## 0.5.4 -0 1.02.2024

### Added

### Changed

### Removed

### Fixed

## 0.3.0 - 10.01.2024

### Added

-   `@dojoengine/state` - State sync functions

### Changed

-   `@dojoengine/core` - Simplify dojo provider
-   `examples/react/react-app` - Improve structure and cleanup dojo package preparing for codegen in upcoming version
-   `examples/react/phaser-app` - Improve structure and cleanup dojo package preparing for codegen in upcoming version

### Removed

-   `@dojoengine/react` - Removed state sync and moved to `@dojoengine/state`

### Fixed

-   Minor client improvements and bugs

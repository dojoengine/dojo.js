# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0-beta.1](https://github.com/dojoengine/dojo.js/compare/v0.7.0-beta.0...v0.7.0-beta.1) (2024-04-18)

**Note:** Version bump only for package @dojoengine/create-burner





# [0.7.0-beta.0](https://github.com/dojoengine/dojo.js/compare/v0.6.122...v0.7.0-beta.0) (2024-04-18)

### Bug Fixes

-   added new burner manager functions to examples ([36000ef](https://github.com/dojoengine/dojo.js/commit/36000ef8f6498edf56b9bb666ed4a4af59b93ae7))
-   allow only prefundedAmount on create() options ([5f05a99](https://github.com/dojoengine/dojo.js/commit/5f05a991756ab0d074d93c577871e86f15ac5afa))
-   avoid burner deployment timeout when it is already deployed ([d884450](https://github.com/dojoengine/dojo.js/commit/d88445093d5c74c365436f5a0ef438fdc0e8366e))
-   build dependencies ([f3c85f6](https://github.com/dojoengine/dojo.js/commit/f3c85f69893f10d8ce46a029a3b62770b59755c3))
-   do not init() burner connector hooks when already initialized ([2147cb5](https://github.com/dojoengine/dojo.js/commit/2147cb56e19d83758fbd5528ec3cdc39b5e6d5de))
-   fixed build ([4ab4a35](https://github.com/dojoengine/dojo.js/commit/4ab4a35729bc4f0b2541742e27dd46d0566c07b4))
-   merge ([f039441](https://github.com/dojoengine/dojo.js/commit/f0394415bab233040f45a0ff3959754ec69f799e))
-   moved keyDerivation.ts to utils ([78fe470](https://github.com/dojoengine/dojo.js/commit/78fe4706a12cd8c7843d874e18b0e1510b178f81))

### Features

-   added generateAddressFromSeed() to useBurnerManager ([ce80ad0](https://github.com/dojoengine/dojo.js/commit/ce80ad0bdb3843fba114929925bf38e99182b208))
-   added remove(address) to useBurnerManager ([bdce6e6](https://github.com/dojoengine/dojo.js/commit/bdce6e61269b16c2d09b3bd2a42e72918846b6ee))
-   allow null burner manager on useBurnerManager() ([e4deb87](https://github.com/dojoengine/dojo.js/commit/e4deb87ebfb8c09cc0d73882aef9c6cd27ee89de))
-   burner manager test for generateKeysAndAddress ([fee20ee](https://github.com/dojoengine/dojo.js/commit/fee20ee973da6085297466a0b712ddcc72f08103))
-   burner manager tests for list, get, select, deselect, remove, clear ([1c364c3](https://github.com/dojoengine/dojo.js/commit/1c364c33ef6af2f13d7ca1b0dcad833463ea12d6))
-   burnerManager can create() deterministic accounts ([3f20776](https://github.com/dojoengine/dojo.js/commit/3f2077688d3e3ccf646060aa6235b2d84f7ca3f9))
-   **burners:** add prefunded amount option ([3eef575](https://github.com/dojoengine/dojo.js/commit/3eef5752465c517bc584b6e77cf3aab728430516))
-   **burners:** add prefunded amount option ([3e07803](https://github.com/dojoengine/dojo.js/commit/3e078033ed77c4f7bb2317386566375f5f69e790))
-   deselect burner for guest support ([676f2a9](https://github.com/dojoengine/dojo.js/commit/676f2a924dfd0234a1e4a1f53f09a7090bcfc386))
-   deterministic burner key derivation ([c38b8c4](https://github.com/dojoengine/dojo.js/commit/c38b8c42d9419fcd0c8de592428adf4defe292bd))
-   expose dojo connectors id and name as SWO static functions ([f99754d](https://github.com/dojoengine/dojo.js/commit/f99754d8b09eacb9da4301901cebc676c79c5164))
-   improved burner tests ([a150da6](https://github.com/dojoengine/dojo.js/commit/a150da6c7334cda77ba38026ec0b0a9ea0356264))
-   optionally keep non deployed burners on init() ([854d180](https://github.com/dojoengine/dojo.js/commit/854d180dd58120a472983bd6db4cbbb2f243fb03))
-   return master account and account index on list() ([d4391fb](https://github.com/dojoengine/dojo.js/commit/d4391fb94eef05cd2806895d93b725e39c34ceff))
-   store master account with burner ([89f601e](https://github.com/dojoengine/dojo.js/commit/89f601eb785318ba722f8e45c75c570265af6f8c))
-   wait for burner deployment before returning ([5a8738c](https://github.com/dojoengine/dojo.js/commit/5a8738c4cf77ffba52314d1bdf2a7727b52cee13))

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/burner.png">
  <img alt="Dojo logo" width="120" src=".github/burner.png">
</picture>

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/mark-dark.svg">
  <img alt="Dojo logo" align="right" width="120" src=".github/mark-light.svg">
</picture>

<a href="https://twitter.com/dojostarknet">
<img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/>
</a>
<a href="https://github.com/dojoengine/dojo">
<img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/>
</a>

[![discord](https://img.shields.io/badge/join-dojo-green?logo=discord&logoColor=white)](https://discord.gg/PwDa2mKhR4)
[![Telegram Chat][tg-badge]][tg-url]

[tg-badge]: https://img.shields.io/endpoint?color=neon&logo=telegram&label=chat&style=flat-square&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fdojoengine
[tg-url]: https://t.me/dojoengine

> Note: Starknet Burner Accounts are currently in pre-alpha. Expect breaking changes frequently.

> Warning: You should provide your users with warning explaning that these Accounts are not secure and should not be used for storing large amounts of funds. The keypair is stored in local storage and can be exploited by malicious actors.

# Create Starknet Burner Accounts

Easily manage, create, and interact with burner accounts on Starknets using this library.

## Features:

- Initialize and manage burner accounts.
- Abstracts away intricacies related to creating, fetching, and setting active burner accounts.
- Easily integrate with React apps using the provided hook.
- Vanilla JS support.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [With React](#with-react)
    - [Vanilla JavaScript](#vanilla-javascript)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Installation

You can install `create-burner` using yarn, pnpm, or npm:

```bash
yarn add @dojoengine/create-burner starknet
```

### In the wild:

- [dojo-starter-react-app](https://github.com/dojoengine/dojo-starter-react-app)

## Usage

### With React

After installation, you can easily integrate it into your React app:

```tsx
import { useBurner } from '@dojoengine/create-burner';

const YourComponent = () => {
    const { get, list, select, create, account } = useBurner(options);

    // Rest of your component
}
```

### Vanilla JavaScript

For non-React apps, initialize and manage burners using the `BurnerManager` class:

```typescript
import { BurnerManager } from '@dojoengine/create-burner';

const manager = new BurnerManager(options);
manager.init();
const activeAccount = manager.getActiveAccount();
```

## API

- **useBurner**: A React hook that provides functionalities like creating burners, selecting them, and more.
    - `get(address: string)`: Get a burner account based on its address.
    - `list()`: List all burners.
    - `select(address: string)`: Set a burner as the active account.
    - `create()`: Create a new burner.
    - `account`: The active burner account.
    - `isDeploying`: A boolean that indicates whether a burner is being deployed.
    - `listConnectors()`: List all available connectors that can be used with Starknet React.

- **BurnerManager**: A class for vanilla JS that offers methods to manage burner accounts.
    - `init()`: Initializes the manager.
    - `getActiveAccount()`: Retrieves the active burner account.
    - `get(address: string)`: Get a burner account based on its address.
    - `list()`: List all burners.
    - `select(address: string)`: Set a burner as the active account.
    - `create()`: Create a new burner.
    - `account`: The active burner account.
    - `isDeploying`: A boolean that indicates whether a burner is being deployed.

## Contribute

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

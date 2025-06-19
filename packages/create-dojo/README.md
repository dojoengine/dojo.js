# @dojoengine/create-dojo

Interactive CLI tool for creating Dojo.js applications with various frameworks and configurations.

## Usage

Run the following command to create a new Dojo.js application:

```bash
npx @dojoengine/create-dojo@latest
```

## Features

### Interactive Setup

The CLI guides you through a series of questions to configure your project:

1. **AkatsukiLabs Starter** - Option to use the recommended game development starter
2. **App Type** - Choose between Client App (Frontend) or Worker App (Backend)
3. **Contracts** - Integrate with existing Dojo contracts or create new ones
4. **Framework Selection** - Multiple framework options for client apps:
    - React + Vite
    - Vue + Vite
    - Vanilla JS + Vite
    - SvelteKit
5. **Additional Features** - Optional features like:
    - State management (Zustand, Pinia)
    - UI libraries (Tailwind CSS, Shadcn/ui, Vuetify)
    - Testing frameworks
    - PWA support
    - Linting and formatting tools

### Command Line Options

You can also provide options directly to skip certain prompts:

```bash
npx @dojoengine/create-dojo@latest --use-akatsuki
npx @dojoengine/create-dojo@latest --type client --framework react-vite
npx @dojoengine/create-dojo@latest --contracts-path ../my-contracts
```

Available options:

- `-y, --yes` - Skip prompts and use defaults
- `--use-akatsuki` - Use AkatsukiLabs Starter
- `--type <type>` - App type: client or worker
- `--contracts-path <path>` - Path to existing contracts
- `--framework <framework>` - Framework to use

### Automatic Setup

The CLI automatically:

- Installs the latest Dojo dependencies
- Creates a proper project structure
- Generates `dojoConfig.ts` based on your contracts
- Sets up TypeScript configuration
- Initializes git repository
- Installs all dependencies

### Core Dependencies

All projects include:

- `@dojoengine/core`
- `@dojoengine/sdk`
- `@dojoengine/torii-wasm`
- `@dojoengine/predeployed-connector`

## Development

To work on this package:

```bash
pnpm install
pnpm build
```

## License

MIT

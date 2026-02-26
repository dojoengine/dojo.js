# Dojo.js Agent Guide
- Primary package manager: install deps via `bun install`.
- Workspace builds: `bun run build`; packages only: `bun run build:packages`.
- Lint everything with `bun run lint:check`; auto-fix via `bun run lint`.
- Formatting: `bun run format:check`; apply using `bun run format`.
- Direct Biome usage: `bun run biome:lint:check`, `bun run biome:format:check`.
- Test suite fan-out: `bun run test`; watch mode `bun run test:watch`.
- Target one workspace: `bun run test --filter=@dojoengine/state`.
- Single bun test file: `bun test packages/state/src/__tests__/state.test.ts`.
- Vitest targeting: `bunx vitest run path/to.test.ts --filter "suite"`.
- Prefer turbo filters over manual traversal when possible.
- Keep imports grouped: node/external, blank line, workspace, then relative.
- Do not auto-organize imports; Biome organizeImports is disabled.
- Formatting defaults: 4 spaces, 80 cols, double quotes, trailing commas, semicolons.
- Maintain explicit return types for exported APIs when inference is unclear.
- Avoid `any`; lean on generics, discriminated unions, and utility types.
- React hooks/components follow strict dependency arrays and early returns.
- Error handling: prefer guard clauses, rethrow or surface context, no silent catches.
- Tests should remain deterministic; clean up observables/subscriptions between cases.
- Run lint/format before PRs; avoid unrelated drive-by refactors.

---

## Migrated CLAUDE.md (Legacy)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun install                    # Install dependencies (runs warmup:wasm post-install)
bun run build                  # Full workspace build via turbo
bun run build:packages         # Build only @dojoengine/* packages
bun run dev                    # Watch mode for all packages (20 concurrent)
```

## Testing

```bash
bun run test                   # Run all tests
bun run test --filter=@dojoengine/state    # Single package
bun test packages/state/src/__tests__/state.test.ts  # Single bun test file
bunx vitest run path/to.test.ts --filter "suite"     # Vitest single file
```

## Linting & Formatting

Uses Biome (4 spaces, 80 cols, double quotes, trailing commas, semicolons).

```bash
bun run lint                   # Auto-fix lint issues
bun run lint:check             # Check only
bun run format                 # Auto-fix formatting
bun run format:check           # Check only
```

## Architecture

Bun workspace monorepo with Turbo orchestration. Packages in `/packages/`:

- **@dojoengine/sdk** - Main SDK: Torii clients, message signing, schema-aware queries (web/node builds)
- **@dojoengine/core** - DojoProvider (Starknet RPC wrapper), world contract interactions, ABI compilation
- **@dojoengine/grpc** - gRPC streaming subscriptions to Torii indexer via protobuf
- **@dojoengine/internal** - Shared utilities: schema parsing, query builders, pagination, tokens
- **@dojoengine/state** - Zustand & RECS stores for entity subscriptions
- **@dojoengine/react** - React hooks and RxJS bindings
- **@dojoengine/create-burner** - Burner wallet hooks for local testing
- **@dojoengine/create-dojo** - CLI scaffolding for new Dojo projects

Key external deps: `starknet` (^8.1.2), `@dojoengine/torii-wasm`/`torii-client` (1.8.2), `zustand`, `effect`.

## Code Style

- Keep imports grouped: external → blank line → workspace (`@dojoengine/*`) → blank line → relative
- Biome organizeImports is disabled; maintain manual grouping
- Explicit return types for exported APIs when inference is unclear
- Avoid `any`; use generics and discriminated unions
- Error handling: guard clauses, rethrow with context, no silent catches
- Tests must be deterministic; clean up observables/subscriptions

## Pre-PR Checklist

1. `bun run lint`
2. `bun run format`
3. `bun run test`
4. Create changeset: `bun run changeset`

## Agent Tooling

- **Pre-commit hooks:** run `bin/setup-githooks` (configures `core.hooksPath` for this repo).

- **Source of truth:** `.agents/`.
- **Symlinks:** `CLAUDE.md` is a symlink to this file (`AGENTS.md`). Editor/agent configs should symlink skills from `.agents/skills`.
- **Skills install/update:**

```bash
npm_config_cache=/tmp/npm-cache npx -y skills add https://github.com/cartridge-gg/agents   --skill create-pr create-a-plan   --agent claude-code cursor   -y
```

- **Configs:**
  - `.agents/skills/` (canonical)
  - `.claude/skills` -> `../.agents/skills`
  - `.cursor/skills` -> `../.agents/skills`

## Code Review Invariants

- No secrets in code or logs.
- Keep diffs small and focused; avoid drive-by refactors.
- Add/adjust tests for behavior changes; keep CI green.
- Prefer check-only commands in CI (`format:check`, `lint:check`) and keep local hooks aligned.
- For Starknet/Cairo/Rust/crypto code: treat input validation, authZ, serialization, and signature/origin checks as **blocking** review items.

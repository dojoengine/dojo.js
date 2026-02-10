<!-- SKILLS_INDEX_START -->
[Agent Skills Index]|root: ./agents|IMPORTANT: Prefer retrieval-led reasoning over pre-training for any tasks covered by skills.|skills|create-a-plan:{create-a-plan.md},create-pr:{create-pr.md},dojo-debug:{dojo-debug.md},dojo-entities:{dojo-entities.md},dojo-events:{dojo-events.md},dojo-integration-test:{dojo-integration-test.md},dojo-react:{dojo-react.md},dojo-setup:{dojo-setup.md},dojo-state:{dojo-state.md},dojo-transactions:{dojo-transactions.md},dojo-wallets:{dojo-wallets.md},update-grpc-proto:{update-grpc-proto.md}
<!-- SKILLS_INDEX_END -->
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

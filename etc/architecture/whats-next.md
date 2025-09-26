# What's Next for Dojo.js

This roadmap captures the near-to-mid term architecture initiatives planned for the main branch. Each stream lists intent, key activities, and expected outcomes to inform prioritisation and sequencing.

## 1. Revamped Type System

- **Objective**: Replace the existing world/type plumbing with the new type system in `packages/core/src/types` to improve safety and compatibility with Cairo models.
- **Key Steps**:
  1. Audit current exports and downstream usage across `core`, `sdk`, `state`, and `react` packages.
  2. Implement adapters or codemods to bridge the new types with legacy consumers while migration is in progress.
  3. Expand compiler/test coverage to prevent regressions (e.g., schema parsing, manifests, provider actions).
- **Deliverables**: Updated type definitions, migration guide, comprehensive test suite for the new abstractions.

## 2. Framework-Agnostic Application Bindings

- **Objective**: Reduce React-specific hooks in favour of framework-agnostic bindings that can power multiple UI layers.
- **Key Steps**:
  1. Extract core data subscription logic (currently in `@dojoengine/react`) into reusable primitives (signals, observables, store interfaces).
  2. Provide thin React adapters while enabling alternative bindings (e.g., Solid, Vue, Svelte) to consume the same core APIs.
  3. Update examples and documentation to highlight the framework-neutral approach.
- **Deliverables**: Core binding package with React wrapper, updated samples, migration notes.

## 3. Abstract Starknet.js Dependencies

- **Objective**: Introduce an abstraction layer over Starknet.js so that downstream packages can swap providers or polyfill functionality.
- **Key Steps**:
  1. Identify all points where Starknet.js types/classes are imported directly (providers, accounts, signing flows).
  2. Define an interface-based contract (e.g., `IStarknetTransport`, `Signer`, `AccountAdapter`) and implement default Starknet.js adapters.
  3. Provide dependency injection hooks in SDK/provider constructors and document how to supply alternative transports.
- **Deliverables**: Adapter interfaces, default Starknet.js implementation, updated dependency guidelines.

## 4. TanStack DB Integration

- **Objective**: Leverage TanStack DB for richer client-side entity persistence, caching, and querying.
- **Key Steps**:
  1. Experiment with a proof-of-concept mapping Torii entity snapshots into TanStack DB tables.
  2. Define schema generation rules based on Dojo manifests and integrate with state management.
  3. Expose opt-in APIs within the SDK or a companion package for consuming TanStack DB features.
- **Deliverables**: Prototype integration, API surface proposal, pilot example demonstrating offline/query benefits.

## 5. Native gRPC Client Enhancements

- **Objective**: Continue maturing the native gRPC client for reliability and feature completeness.
- **Key Steps**:
  1. Close remaining parity gaps with Torii WASM client (subscriptions, controllers, token operations).
  2. Harden connection lifecycle management (reconnects, backoff, streaming ergonomics).
  3. Ship performance benchmarks and cross-platform validation (Node, Bun, browser with WASM transport).
- **Deliverables**: Stable gRPC client API, resilience improvements, documentation and benchmarks.

## 6. Frontend Observability Integrations

- **Objective**: Provide opt-in hooks to plug observability tools (Sentry, PostHog, etc.) into Dojo.js-powered apps.
- **Key Steps**:
  1. Define instrumentation points (SDK events, subscription lifecycle, transaction workflows).
  2. Create lightweight adapters for popular observability providers with configuration patterns.
  3. Document best practices and privacy considerations for instrumenting on-chain interactions.
- **Deliverables**: Observability integration guide, reference adapters, example instrumentation snippets.

## Cross-Cutting Considerations

- Maintain incremental delivery via stacked `jj` changes to keep reviews focused.
- Prioritise documentation and migration notes alongside each feature.
- Invest in automated tests and benchmarks as new abstractions are introduced to safeguard performance and developer experience.

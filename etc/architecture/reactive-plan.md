# @dojoengine/reactive Package Plan

## 1. Vision & Scope
- Deliver a high-throughput, eventually consistent local read layer for Torii-indexed worlds.
- Hide synchronization complexity behind a thin, reactive API suitable for UI layers and server runtimes.
- Provide an optimistic overlay that lets applications read/write against pending transactions with automatic rollback.
- Operate comfortably inside browsers (IndexedDB + WebWorkers) while remaining portable to server/Node contexts.

## 2. Guiding Principles
- **Deterministic sync loops:** predictable state machine, resumable via persisted cursors and checkpoints.
- **Isolation of concerns:** separate sync orchestration, storage, and overlay so each can be tested independently.
- **Optimistic-first UX:** reads should consider overlay data before hitting persisted snapshots.
- **Type-informed access:** lean on schema metadata from existing packages (`@dojoengine/internal`, `@dojoengine/sdk`).
- **Pluggable persistence:** abstract storage so browser builds use IndexedDB while Node/Bun use SQLite or similar.
- **Observability:** expose hooks for logging, metrics, and conflict tracing early to aid debugging.

## 3. High-Level Architecture
```
             ┌─────────────────────┐
             │  Application Layer  │
             │  (React, state, CLI)│
             └───────────┬─────────┘
                         │
              Reactive Client API
                         │
┌───────────────┬────────┴──────────┬─────────────────┐
│ Overlay Layer │  Read Cache/Index │  Sync Orchestrator│
└──────┬────────┴────────┬──────────┴───────────┬─────┘
       │                 │                      │
  Overlay Store    IndexedDB Adapter      Torii Transport
       │                 │                      │
       └───────── Persisted State ◀─────────────┘
```

- The **Reactive Client API** hides worker messaging, exposes query/subscribe primitives, and mediates overlay visibility.
- The **Sync Orchestrator** (the `Synchronizer`) owns the fetch ➝ transform ➝ persist pipeline, running inside a worker.
- The **IndexedDB Adapter** provides transactional reads/writes, schema migrations, and snapshot queries.
- The **Overlay Layer** keeps pending commits, merges overlay state into reads, and handles rollback once chain state finalizes.
- **Torii Transport** uses `torii-wasm` (browser) or `@dojoengine/grpc` (Node) adapters under a thin transport abstraction.

## 4. Core Modules & Responsibilities

### 4.1 Synchronizer (backbone)
- **Inputs:** Torii URL/config, schema metadata, sync targets (`entities`, `tokens`, `tokenContracts`, etc.), optional filters.
- **Outputs:** Persisted records, progress metrics (last block/time), and overlay reconciliation signals.
- **State Machine:** `idle → bootstrapping → streaming → pausing → halted`. Persist cursor between runs.
- **Pipelines:** chunked fetch ➝ decode ➝ normalise ➝ batch write ➝ checkpoint; support retries/backoff.
- **Concurrency Model:** runs in dedicated worker; leverages `AbortController` for stop/reset; communicates via message channel (postMessage or `BroadcastChannel` for multi-tab).
- **Extensibility:** configure fetch order, page size, back-pressure thresholds, and optional inclusion filters.
- **Failure Handling:** exit to `halted` on unrecoverable errors with diagnostic payload; schedule automatic retries for transient Torii/network failures.

### 4.2 Storage Layer (IndexedDB adapter)
- **Scope:** internal package; exported types limited to configuration and testing utilities.
- **Implementation:** typed wrapper (likely around `idb` helper or custom) enforcing schema migrations and atomic writes.
- **Object Stores (initial draft):**
  - `entities` keyed by composite world address/entityId.
  - `entityKeys` for secondary indexes (component combinations).
  - `tokens` keyed by `(contractAddress, tokenId)`.
  - `tokenContracts` keyed by contract address.
  - `sync_meta` for checkpoints, cursors, sync metrics.
  - `overlay_ops` for optimistic overlay entries (mirrors overlay layer).
- **APIs:** `initDb`, `withTransaction`, `putBatch`, `getSnapshot`, `iterateRange`, `prune`.
- **Migrations:** versioned upgrade path; tests covering forward/backward compatibility.
- **Testing Aids:** Node fallback via `fake-indexeddb` in Vitest, deterministic seeding helpers.
- **Future Backends:** define `StorageAdapter` interface now so a SQLite-backed implementation can replace or augment IndexedDB in Node/Bun without touching synchronizer logic.

### 4.3 Overlay Prediction Layer
- **Purpose:** stage optimistic reads while transactions are pending confirmation.
- **Entities:** overlay operation has `id`, `type` (`upsert`/`delete`), payload snapshot, references to originating transaction.
- **Commit Flow:** on transaction submission, create overlay entries; overlay is queried first; once Torii confirms, merge into persisted state.
- **Rollback:** if transaction fails/times out, remove overlay entries, emit revert events to subscribers.
- **Conflict Strategy:** maintain deterministic merge order (timestamp + priority); allow plugins for custom resolution.
- **API Surface:** `overlay.apply`, `overlay.rollback`, `overlay.inspect`. Provide event stream for UI.
- **Sync Interaction:** synchronizer listens for overlay commits; on confirmation, deduplicates to avoid double application.

### 4.4 Worker Integration & Messaging
- **Worker Entrypoints:** `sync.worker.ts` (browser `Worker`), `node-sync.ts` (Node worker_threads fallback).
- **Message Protocol:** typed messages for `INIT`, `SYNC_REQUEST`, `SYNC_PROGRESS`, `SYNC_COMPLETE`, `ERROR`, `RESET`, `OVERLAY_COMMIT`, `OVERLAY_ROLLBACK`.
- **Shared Contracts:** publish `ReactiveMessage` TypeScript enums/interfaces for compile-time safety.
- **Lifecycle:** main thread instantiates worker, sends config, worker acknowledges readiness, subsequent sync triggers drive state machine.
- **Resource Control:** ability to pause/resume, throttle background sync, dispatch manual refresh.

### 4.5 Public API Surface (initial sketch)
- `createReactiveClient(options)` ➝ returns `{ query, subscribe, getSnapshot, syncStatus, submitOverlay, dispose }`.
- `createSyncWorker(options)` for advanced control.
- `reactiveSelectors` utilities (`selectEntity`, `selectComponent`, `listTokens`), leveraging overlay-first reads.
- `OverlayHandle` for manual optimistic updates (`handle.commit`, `handle.rollback`).
- Provide typed events via `EventEmitter` or `observable` primitive (align with existing `@dojoengine/state` patterns).
- Keep exports minimal until stabilised; mark advanced hooks as experimental.

### 4.6 Integration Touchpoints
- **With `@dojoengine/sdk`:** reuse schema discovery, entity parsing utilities. Synchronizer should accept SDK-style component definitions.
- **With `@dojoengine/state`/`react`:** offer adapter that feeds existing stores with overlay-aware data; plan cross-package PoC later.
- **With `torii-wasm` & `grpc`:** wrap under `ReactiveToriiClient` interface to allow swapping implementations during tests.
- **Config:** align logging/config management with `@dojoengine/internal` patterns.

## 5. TDD Strategy
- **Test Runner:** Vitest (already standard) + `happy-dom` or Node + `fake-indexeddb` for browser APIs.
- **Fixture Setup:** build reusable Torii mock server (`MockToriiService`) that replays scripted pages/cursors; provide builders for entities/tokens.
- **Synchronizer Tests:**
  - state machine transitions with deterministic inputs.
  - pagination/backoff logic with injected failures.
  - persistence of checkpoints across restart scenarios.
- **Storage Tests:**
  - migrations (upgrade from v1→v2, failing mid-upgrade).
  - atomic batch writes, index lookups, pruning logic.
- **Overlay Tests:**
  - commit and rollback flows; conflict resolution strategies.
  - overlay merging with persisted snapshots for read queries.
- **API Contract Tests:**
  - `createReactiveClient` integration using worker mocked via `MessagePort`.
  - Query subscriptions ensuring overlay-first responses.
- **Performance Baselines:** micro benchmarks for batch insert throughput (optional but track).
- **CI Hooks:** add `packages/reactive/vitest.config.ts`, include in root `turbo test`.

## 6. Implementation Roadmap
1. **Foundations**
   - Scaffold `packages/reactive` with tsconfig, tsup, lint/test scripts.
   - Draft module boundaries (folders: `synchronizer`, `storage`, `overlay`, `worker`, `client`, `test-utils`).
2. **Storage MVP**
   - Implement IndexedDB adapter with `sync_meta` + `entities` stores.
   - Write unit tests using `fake-indexeddb`; ensure migrations tested.
3. **Synchronizer MVP**
   - Define Torii transport interface; stub `getEntities` path.
   - Build state machine, fetch loop, batch writes to storage.
   - Cover tests for resumes, transient failures, idempotent writes.
4. **Worker Harness**
   - Create worker entrypoint, message contracts, main-thread controller.
   - Mocked tests verifying message sequencing and cancellation.
5. **Overlay Layer**
   - Implement overlay store with commit/rollback semantics.
   - Reconcile overlay with persisted data; update queries to merge views.
6. **Query/Subscription API**
   - Expose read API integrating overlay + storage.
   - Provide reactive subscriptions (likely using `EventEmitter` or reusing `@dojoengine/state` patterns).
7. **Advanced Sync Targets**
   - Extend synchronizer to `getTokens`, `getTokenContracts`, other Torii endpoints.
   - Support dynamic sync target registration.
8. **Observability & Tooling**
   - Logging hooks, metrics collectors, developer debugging helpers.
9. **Documentation & Samples**
   - Author README, usage snippets, integration guide with existing packages.
   - Provide example app wiring worker + overlay.
10. **Multi-Backend Storage (Future)**
   - Add SQLite storage adapter for Node/Bun environments once core flows are stable; reuse shared `StorageAdapter` contract to keep synchronizer/client logic unchanged.

Roadmap is iterative; each numbered phase should be merged with full test coverage before moving on.

## 7. Deliverables by Milestone
- **Milestone A (Foundations + Storage):** package scaffold, IndexedDB adapter, unit tests, documentation stub.
- **Milestone B (Synchronizer MVP):** worker-less synchronizer syncing entities to storage with tests + CLI harness.
- **Milestone C (Worker Integration):** worker orchestration, main-thread client API returning snapshots.
- **Milestone D (Overlay Optimism):** optimistic overlay end-to-end with integration tests.
- **Milestone E (Production Hardening):** extended Torii targets, backoff tuning, observability, example integration.

## 8. Open Questions & Assumptions
- Need confirmation on Torii pagination limits and whether gRPC streaming is required for MVP.
- Clarify which environments must be supported at launch (browser only vs universal).
- Decide on dependency policy: can we depend on `idb`, `dexie`, `better-sqlite3`, etc., or must adapters be from scratch?
- Determine how overlay events integrate with existing state hooks (delegate to `@dojoengine/state` or ship new primitives?).
- Validate how transaction confirmations are surfaced (SDK events? direct Torii subscription?).
- Confirm expectations for storage footprint management (compaction, TTL).

## 9. Next Steps
- Review this plan with stakeholders, refine interfaces, and prioritise milestones.
- Once approved, create initial package scaffold (Milestone A) and open tracking issues for each roadmap item.

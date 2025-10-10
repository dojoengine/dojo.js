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
- **Manifest/Torii fingerprinting:** compute a canonical manifest hash (class hashes + model member signatures, sorted deterministically) via `sha256`, prefix with `manifest-hash:v1:` and persist alongside the Torii server `version` retrieved from `${toriiUrl}/`. During `initDb`, compare stored vs computed values; raise `SchemaMismatch` if the hash differs, `ToriiVersionChanged` if only the server version drifted. Host catches both conditions on startup and decides remediation (prompt + `reset()`).
- **Utility placement:** add `packages/reactive/src/utils/manifest.ts` exporting `computeManifestHash(manifest: Manifest): string` and `buildManifestFingerprint(manifest: Manifest): ManifestFingerprint` (plain data struct used in tests and metadata records). Re-export via package entrypoint so worker/main thread share identical logic and avoid drift.
- **v1 IndexedDB schema:** version `1` defines `entities` (keyPath `entityId`, value is Torii `types.Entity` JSON via structured clone), `sync_meta` (keyPath `["targetType","targetId"]`, storing `{ cursor, lastTimestamp, updatedAt }`), `overlay_ops` (keyPath `opId`, index on `entityId`), `tokens`, `tokenContracts`, and `metadata` (keyPath `key`). Write-path uses a single `readwrite` transaction spanning `entities` + `sync_meta` per model batch so cursor and payload commit atomically.
- **Adapter surface:** expose `computeManifestHash(manifest)` helper, `initDb({ dbName, manifest, toriiVersion })` returning `{ db, manifestHash }`, transactional helpers (`withTransaction`), entity writers (`batchUpsertEntities(model, entities)`), snapshot readers, sync-state persistence (`getSyncState`/`persistSyncState`), and a `reset()` utility to drop the DB when host elects to recover from mismatches.
- **Module layout:** scaffold `packages/reactive/src/storage/indexeddb/adapter.ts` housing the concrete IndexedDB implementation, exporting an interface `ReactiveStorageAdapter` consumed by the synchronizer. Provide a thin barrel at `packages/reactive/src/storage/index.ts` that resolves environment-specific adapters (browser vs Node shim) and re-exports common error types (`SchemaMismatchError`, `ToriiVersionChangedError`).
- **Lookup strategy:** all models share the `entities` object store (multi-model table). Direct entity reads leverage primary key lookups by `entityId`. Any finer-grained filtering (`where` clauses) falls back to JS-side filtering of the fetched batch for v1; future schema-aware secondary indexes will be opt-in via a developer-supplied indexing schema (API to be designed post-MVP).
- **Future schema builder:** pave the way for an ORM-style API (`storage.schema.createTable`, `addIndex`, `dropIndex`) that consumers can call during `initDb` to register custom tables/indexes on top of the core stores. MVP keeps the API unimplemented but reserves namespace so later releases don’t break surface area.

### 4.3 Overlay Prediction Layer
- **Purpose:** wrap storage/backend with a "fresh memory" buffer so UI reads reflect latest user intent immediately while Torii catches up; overlay sits in front of the cache with no opt-out for consumers.
- **Record shape:** each entry persists `{ opId, entityId, model, operation, payload, transactionId, occurredAt, guard }`. `payload` mirrors the Torii entity shape for the touched models; `guard` (optional) encodes the condition that must be satisfied once Torii data arrives (e.g., matcher against stored entity).
- **Conflict Strategy:** optimistic updates to the same entity replace prior overlay state when the supplied `guard` validates that the transition is coherent; otherwise reject and surface an error. Latest valid operation wins; Torii eventually reconciles the canonical state.
- **Commit/Ack Flow:** when a write is submitted, push overlay entry into in-memory store (and persist to `overlay_ops` so reloads retain intent). Synchronizer (or host-provided callback) polls Torii; once the `guard` predicate passes against the persisted entity, mark overlay entry as confirmed and drop it.
- **Rollback:** if the `guard` never matches before a configurable timeout (`overlayExpiryMs`), automatically roll back the entry, emit revert events, and surface failure to callers. Manual rollback API also available.
- **Scope:** overlay is local to a single runtime (tab/process); multi-tab syncing is deferred. No BroadcastChannel coordination in v1.
- **API Surface:** expose high-level methods `submitOverlay({ entityId, model, payload, transactionId, guard, timeoutMs })`, `getOverlayFor(entityId)`, `ackOverlay(transactionId)`, `rollbackOverlay(transactionId)`; events notify the client API so subscribers refresh merged state.
- **Sync Interaction:** reads always merge overlay-first (`overlay` ➝ `entities` ➝ remote fallbacks). Synchronizer checks `overlay_ops` before applying fresh Torii data to avoid double-application and to satisfy `guard` contracts.
- **Guard scheduler:** guards are runtime callbacks registered alongside overlay entries; scheduler polls storage every `guardPollIntervalMs` and drops entries once the predicate returns true. Overlay state is volatile—on reload we discard all overlay entries (transactions are expected to settle within ~2–3 s), preventing stale optimism without needing guard persistence.

### 4.4 Worker Integration & Messaging
- **Workers by platform:** ship dedicated synchronizer entrypoints: `sync.browser.worker.ts` (Web Worker) and `sync.node.worker.ts` (`worker_threads`). Tests/SSR can mock the worker API; no inline fallback in v1 to keep concurrency semantics consistent.
- **Message Protocol:** typed messages covering `INIT` (config + manifest hash + toriiVersion), `INIT_ACK`, `SYNC_TICK` (worker pushing state transitions), `SYNC_ERROR`, `SYNC_FATAL`, and `SHUTDOWN`. Start lean; extend as gaps surface.
- **Lifecycle:** host spins up appropriate worker, sends `INIT`, worker bootstraps storage + synchronizer loop, then runs continuous sync while the application is alive (idle/backoff between pulls). Main thread mainly observes `SYNC_TICK` events for progress.
- **Scheduling & backoff:** worker owns the polling loop; it immediately schedules the next fetch once a batch is persisted, applying exponential backoff on transient failures. No external triggers required for steady-state operation.
- **Default cadence:** baseline poll interval `syncIntervalMs = 2_000` per model when healthy. On transient failure, use exponential backoff capped at `backoffMaxMs = 60_000`, jittered by ±10 % to avoid thundering herd. After success, reset to baseline. Sync ticks include `nextPollInMs` reflecting the current schedule.
- **Abort semantics:** main thread does not interrupt in-flight pulls; the worker handles retries internally and only stops on `SHUTDOWN`.
- **Error propagation:** non-fatal errors trigger `SYNC_ERROR` messages (with retry metadata). Irrecoverable issues (e.g., schema mismatch after init) surface as `SYNC_FATAL`, prompting host intervention.
- **Overlay coordination:** overlay mutations write straight to the shared storage via main-thread adapter access; worker’s sync loop reads storage snapshots and prunes overlay entries when guard callbacks report success. No overlay-specific messages cross the worker boundary in v1.
- **`SYNC_TICK` payload:** emit `{ clock: number, overall: { state, lastSyncedAt, lagMs, pendingOverlayCount }, models: Array<{ model: string, status: "idle" | "bootstrapping" | "streaming" | "retrying", lastCursor?: string, lastTimestamp?: number, lastBatchSize: number, consecutiveFailures: number, nextPollInMs: number, overlayPending?: number, throughputPerSec?: number }> }`. Keeps UI informed with per-model throughput + outstanding overlay indicators so UX can surface stale segments quickly.

### 4.5 Public API Surface (initial sketch)
- **Primary entrypoint:** `createReactiveClient({ toriiUrl, manifest, models, storageFactory, overlayOptions })` boots the worker, wires the IndexedDB adapter, exposes high-level methods `{ query, subscribe, mutate, submitOverlay, getSyncStatus, shutdown }`. Client hides worker messaging, manifest hashing, and storage management.
- **Lifecycle:** client lazily instantiates worker on first call; returns a `ready` promise resolving once an initial `SYNC_TICK` arrives. `shutdown()` tears down worker + overlay scheduler.
- **Error surfacing:** emit an `errors` observable (or event emitter) delivering `SchemaMismatch`, `ToriiVersionChanged`, `SyncFatal` events so hosts can present actionable UI.
- **Advanced control:** expose `createSyncWorker(options)` for Node/CLI environments that want to integrate the synchronizer without the full reactive API (e.g., server-side prewarm).
- **Selectors/helpers:** ship `reactiveSelectors` (`selectEntity`, `selectComponent`, `selectMany`, `listTokens`) that always merge overlay-first results and provide type inference from the manifest.
- **Overlay handles:** `mutate` returns `{ transactionId, rollback, guard }` handles so UIs can hook into optimistic lifecycles; internally they delegate to the overlay scheduler.
- **Streams:** provide typed observables for `syncStatus` (wrapping `SYNC_TICK` payloads) and `entityUpdates` (overlay + storage deltas). Align implementation with existing `@dojoengine/state` conventions for ease of adoption.
- **Exports:** keep surface minimal until stabilized; gate experimental hooks under `unstable_*` prefix.
- **Query primitives:** `query(model, { filter, limit, cursor, consistency })` returns overlay-first snapshots, with `filter` expressed via manifest-aware predicates (Exact keys, member comparisons). `consistency` defaults to `"overlay-first"`; `"persisted-only"` is reserved for debugging/internal use.
- **Subscriptions:** `subscribe(model, selector, listener, options?)` registers overlay-mutable streams; `selector` narrows fields/components, and `options` allow throttle/debounce for UI performance. Returns `unsubscribe`.
- **Mutations:** `mutate(model, payload, { guard, timeoutMs })` wraps overlay submission + optional RPC call (if provided by host). On success, guard monitors Torii data until confirmation; on timeout, emits rollback event and optionally rethrows.
- **Filter DSL:** support structured predicates aligned with manifest metadata: `{ keys?: Record<string,string|number>, where?: Array<{ member: string, op: "eq"|"neq"|"gt"|"gte"|"lt"|"lte"|"in", value: Primitive }> }`. Storage adapter translates into IndexedDB lookups (keys → primary key via hashed_keys, `where` fallback to scan + filter). Future extension includes composite indexes; design DSL now to keep backwards compatibility.
- **Selector schema:** `selector` accepts either `null` (entire entity) or `{ include?: string[], exclude?: string[] }` referencing manifest member paths. Implementation prunes fields after overlay merge before returning to caller.
- **Overlay defaults:** `overlayOptions` provide `{ guardPollIntervalMs = 500, timeoutMs = 30_000 }`; guard scheduler respects these defaults per mutation unless caller overrides.
- **Error taxonomy:** `errors` stream emits typed payloads: `SchemaMismatchError { manifestHash, storedHash }`, `ToriiVersionChangedError { previous, current }`, `SyncFatalError { reason, lastTick }`, `OverlayTimeoutError { transactionId, entityId, guardDescription }`. Guidance docs cover recommended host reactions for each.

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

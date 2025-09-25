# Dojo.js Knowledge Base

## Architecture Snapshot (Main Branch)

- Reference diagram: [docs/architecture/overview.md](architecture/overview.md)
- Highlights:
  - `@dojoengine/sdk` connects Torii indexer clients, message signing, and schema parsing for app consumption.
  - `@dojoengine/core` offers the `DojoProvider` Starknet RPC interface for direct world contract access.
  - `@dojoengine/grpc` provides streaming access to Torii via the `ToriiGrpcClient` and related mappers.
  - UI/state layers (`@dojoengine/state`, `@dojoengine/react`) build on the SDK for entity subscriptions and optimistic updates.
  - Tooling packages (`create-burner`, `predeployed-connector`, `create-dojo`) streamline wallet setup and application scaffolding.

_Last updated: 2025-09-25T13:27:58Z

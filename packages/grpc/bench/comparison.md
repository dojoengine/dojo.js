# gRPC-Web vs torii-wasm Benchmark Results

Performance comparison between `@dojoengine/grpc` and `@dojoengine/torii-wasm`.

## Summary

- **Average ops/sec**: gRPC-Web: 67,095, torii-wasm: NaN
- **Overall performance**: gRPC-Web is NaN% compared to torii-wasm

## Detailed Results

### src/benchmarks/entities.bench.ts > Entity Queries Benchmark > Single Entity Retrieval

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|
### src/benchmarks/entities.bench.ts > Entity Queries Benchmark > Batch Entity Retrieval (100 entities)

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|
### src/benchmarks/entities.bench.ts > Entity Queries Benchmark > Complex Query (Multiple Models)

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|
### src/benchmarks/entities.bench.ts > Entity Queries Benchmark > Pagination (Next Page)

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|

### src/benchmarks/integration.bench.ts > Integration Benchmark - Real-world Scenarios > Complete Query Lifecycle

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|
### src/benchmarks/integration.bench.ts > Integration Benchmark - Real-world Scenarios > Mixed Workload (Query + Subscribe)

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|
### src/benchmarks/integration.bench.ts > Integration Benchmark - Real-world Scenarios > Error Recovery

| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
|-----------|-------------------|---------------------|------------|------------------|-------------------|

## Interpretation Guide

- **ops/sec**: Higher is better (more operations per second)
- **Mean Time**: Lower is better (less time per operation)
- **Positive percentage**: gRPC-Web is faster
- **Negative percentage**: torii-wasm is faster

## Test Environment

- Date: 2025-07-25T08:59:59.123Z
- Node.js: v22.6.0
- Platform: darwin arm64

# Benchmark Guide

This guide explains how to run and interpret the benchmarks comparing `@dojoengine/grpc` with `@dojoengine/torii-wasm`.

## Prerequisites

1. A running torii instance (default: `http://localhost:8080`)
2. Both packages installed: `@dojoengine/grpc` and `@dojoengine/torii-wasm`

## Running Benchmarks

### Quick Start

```bash
# Run all benchmarks and generate report
pnpm run bench:full
```

### Individual Commands

```bash
# Run benchmarks only
pnpm run bench

# Generate report from existing results
pnpm run bench:report
```

### Environment Variables

Configure the benchmark environment:

```bash
# Set torii URL (default: http://localhost:8080)
export TORII_URL=http://your-torii-instance:8080

# Set torii gRPC URL (default: http://localhost:8080)
export TORII_GRPC_URL=http://your-grpc-endpoint:8080

# Set world address (default: 0x0)
export WORLD_ADDRESS=0x1234...
```

## Benchmark Categories

### 1. Entity Queries (`entities.bench.ts`)

Tests entity retrieval performance:

- **Single Entity**: Fetches one entity
- **Batch Retrieval**: Fetches 100 entities
- **Complex Query**: Multiple models in one query
- **Pagination**: Second page retrieval

### 2. Subscriptions (`subscriptions.bench.ts`)

Tests real-time subscription performance:

- **Setup Time**: Initial connection overhead
- **Message Processing**: Throughput for first 10 messages
- **Concurrent Subscriptions**: 5 simultaneous connections

### 3. Serialization (`serialization.bench.ts`)

Tests data encoding/decoding performance:

- **Small Payload**: Single entity encoding
- **Complex Structure**: Nested objects with arrays
- **Batch Processing**: 100 entities
- **Large Payload**: 1000 entities

### 4. Integration (`integration.bench.ts`)

Tests real-world scenarios:

- **Full Lifecycle**: Connect → Query → Disconnect
- **Mixed Workload**: Queries + Subscriptions
- **Error Recovery**: Invalid query handling

## Understanding Results

### Metrics

- **ops/sec**: Operations per second (higher is better)
- **Mean Time**: Average time per operation in milliseconds (lower is better)
- **Difference %**: Performance comparison between implementations

### Latest Benchmark Results

#### Entity Queries

| Operation            | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
| -------------------- | ------------------ | -------------------- | ---------- | ---------------- | ----------------- |
| Single Entity        | 1,303              | 1,084                | +20.2%     | 0.767ms          | 0.923ms           |
| Batch (100 entities) | 1,309              | 1,166                | +12.3%     | 0.764ms          | 0.858ms           |
| Complex Query        | 1,265              | 1,091                | +15.9%     | 0.791ms          | 0.916ms           |
| Pagination           | 1,450              | 1,368                | +6.0%      | 0.690ms          | 0.731ms           |

#### Integration Tests

| Operation      | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |
| -------------- | ------------------ | -------------------- | ---------- | ---------------- | ----------------- |
| Full Lifecycle | 21.9               | 22.8                 | -4.0%      | 45.8ms           | 43.8ms            |
| Mixed Workload | 1,118              | 952                  | +17.4%     | 0.894ms          | 1.051ms           |
| Error Recovery | 21.6               | 20.8                 | +3.8%      | 46.3ms           | 48.2ms            |

In these results:

- gRPC-Web generally performs better for simple queries
- torii-wasm shows slightly better performance for full lifecycle operations
- Performance differences vary by operation type

### Performance Factors

Results can vary based on:

1. **Network latency**: Distance to torii server
2. **Payload size**: Larger entities take longer
3. **Server load**: Concurrent users affect performance
4. **Hardware**: CPU and memory impact results

## Choosing Between Implementations

### Use gRPC-Web when:

- You need standard web compatibility
- Protocol buffer type safety is important
- You're already using gRPC in your stack
- Debugging tools are a priority

### Use torii-wasm when:

- Maximum performance is critical
- You need the lowest possible latency
- Memory usage must be minimized
- You're comfortable with WASM tooling

## Troubleshooting

### Common Issues

1. **Connection Errors**
    - Verify torii is running at the configured URL
    - Check CORS settings for gRPC-Web endpoint
    - Ensure proper authentication if required

2. **No Results Generated**
    - Run benchmarks first: `pnpm run bench`
    - Check for errors in console output
    - Verify `bench/results.json` exists

3. **Inconsistent Results**
    - Run benchmarks multiple times
    - Close other applications to reduce noise
    - Use a stable network connection
    - Consider server-side factors

### Debug Mode

Enable detailed logging:

```bash
DEBUG=* pnpm run bench
```

## Contributing

To add new benchmarks:

1. Create a new file in `src/benchmarks/`
2. Follow the existing pattern using `bench()` and `describe()`
3. Add both gRPC-Web and torii-wasm implementations
4. Update this documentation

Example benchmark structure:

```typescript
import { bench, describe } from "vitest";

describe("My New Benchmark", () => {
    bench("gRPC-Web implementation", async () => {
        // Your gRPC-Web test
    });

    bench("torii-wasm implementation", async () => {
        // Your torii-wasm test
    });
});
```

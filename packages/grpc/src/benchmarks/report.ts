#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface BenchmarkResult {
    name: string;
    hz: number; // Operations per second
    mean: number; // Mean time in ms
    variance: number;
    samples: number;
}

interface BenchmarkGroup {
    fullName: string;
    benchmarks: BenchmarkResult[];
}

interface Benchmark {
    files: BenchmarkFile[];
}
interface BenchmarkFile {
    filepath: string;
    groups: BenchmarkGroup[];
}

// Read benchmark results from JSON file
function readResults(filePath: string): Benchmark {
    if (!existsSync(filePath)) {
        console.error(`Benchmark results file not found: ${filePath}`);
        console.log("Run 'pnpm bench' first to generate results.");
        process.exit(1);
    }

    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

// Format number with commas
function formatNumber(num: number): string {
    return Math.round(num).toLocaleString();
}

// Calculate performance difference percentage
function calculateDiff(grpc: number, torii: number): string {
    const diff = ((grpc - torii) / torii) * 100;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}%`;
}

// Generate markdown comparison table
function generateComparisonTable(files: BenchmarkFile[]): string {
    let markdown = "# gRPC-Web vs torii-wasm Benchmark Results\n\n";
    markdown +=
        "Performance comparison between `@dojoengine/grpc` and `@dojoengine/torii-wasm`.\n\n";
    markdown += "## Summary\n\n";

    // Overall summary
    let totalGrpcOps = 0;
    let totalToriiOps = 0;
    let benchmarkCount = 0;

    files.forEach((file) => {
        file.groups.forEach((group) => {
            group.benchmarks.forEach((bench) => {
                if (bench.name.includes("gRPC-Web")) {
                    totalGrpcOps += bench.hz;
                    benchmarkCount++;
                } else if (bench.name.includes("torii-wasm")) {
                    totalToriiOps += bench.hz;
                }
            });
        });
    });

    const avgGrpcOps = totalGrpcOps / benchmarkCount;
    const avgToriiOps = totalToriiOps / benchmarkCount;

    markdown += `- **Average ops/sec**: gRPC-Web: ${formatNumber(avgGrpcOps)}, torii-wasm: ${formatNumber(avgToriiOps)}\n`;
    markdown += `- **Overall performance**: gRPC-Web is ${calculateDiff(avgGrpcOps, avgToriiOps)} compared to torii-wasm\n\n`;

    markdown += "## Detailed Results\n\n";

    // Process each benchmark group
    files.forEach((file) => {
        file.groups.forEach((group) => {
            markdown += `### ${group.fullName}\n\n`;
            markdown +=
                "| Operation | gRPC-Web (ops/sec) | torii-wasm (ops/sec) | Difference | Mean Time (gRPC) | Mean Time (torii) |\n";
            markdown +=
                "|-----------|-------------------|---------------------|------------|------------------|-------------------|\n";

            // Group benchmarks by operation name
            const operations = new Map<
                string,
                { grpc?: BenchmarkResult; torii?: BenchmarkResult }
            >();

            group.benchmarks.forEach((bench) => {
                const opName = bench.name
                    .replace(" gRPC-Web", "")
                    .replace(" torii-wasm", "");
                const op = operations.get(opName) || {};

                if (bench.name.includes("gRPC-Web")) {
                    op.grpc = bench;
                } else if (bench.name.includes("torii-wasm")) {
                    op.torii = bench;
                }

                operations.set(opName, op);
            });

            // Generate table rows
            operations.forEach((op, name) => {
                if (op.grpc && op.torii) {
                    const diff = calculateDiff(op.grpc.hz, op.torii.hz);
                    const grpcMean = op.grpc.mean.toFixed(3);
                    const toriiMean = op.torii.mean.toFixed(3);

                    markdown += `| ${name} | ${formatNumber(op.grpc.hz)} | ${formatNumber(op.torii.hz)} | ${diff} | ${grpcMean}ms | ${toriiMean}ms |\n`;
                }
            });
        });

        markdown += "\n";
    });

    markdown += "## Interpretation Guide\n\n";
    markdown +=
        "- **ops/sec**: Higher is better (more operations per second)\n";
    markdown += "- **Mean Time**: Lower is better (less time per operation)\n";
    markdown += "- **Positive percentage**: gRPC-Web is faster\n";
    markdown += "- **Negative percentage**: torii-wasm is faster\n\n";

    markdown += "## Test Environment\n\n";
    markdown += `- Date: ${new Date().toISOString()}\n`;
    markdown += `- Node.js: ${process.version}\n`;
    markdown += `- Platform: ${process.platform} ${process.arch}\n`;

    return markdown;
}

// Main function
function main() {
    const resultsPath = join(process.cwd(), "bench", "results.json");
    const outputPath = join(process.cwd(), "bench", "comparison.md");

    console.log("Reading benchmark results...");
    const results = readResults(resultsPath);

    console.log("Generating comparison report...");
    const report = generateComparisonTable(results.files);

    // Ensure bench directory exists
    const benchDir = join(process.cwd(), "bench");
    if (!existsSync(benchDir)) {
        require("node:fs").mkdirSync(benchDir, { recursive: true });
    }

    writeFileSync(outputPath, report);
    console.log(`Report generated: ${outputPath}`);

    // Also print summary to console
    console.log("\n=== Quick Summary ===");
    results.files.forEach((file) => {
        file.groups.forEach((group) => {
            console.log(`\n${group.fullName}:`);
            const operations = new Map<
                string,
                { grpc?: BenchmarkResult; torii?: BenchmarkResult }
            >();

            group.benchmarks.forEach((bench) => {
                const opName = bench.name
                    .replace(" gRPC-Web", "")
                    .replace(" torii-wasm", "");
                const op = operations.get(opName) || {};

                if (bench.name.includes("gRPC-Web")) {
                    op.grpc = bench;
                } else if (bench.name.includes("torii-wasm")) {
                    op.torii = bench;
                }

                operations.set(opName, op);
            });

            operations.forEach((op, name) => {
                if (op.grpc && op.torii) {
                    const diff = calculateDiff(op.grpc.hz, op.torii.hz);
                    console.log(
                        `  ${name}: gRPC-Web is ${diff} compared to torii-wasm`
                    );
                }
            });
        });
    });
}

main();

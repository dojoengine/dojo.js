import type { Subscription } from "@dojoengine/torii-wasm/types";
// import process from "node:process";

export type DojoWorkerCallback = () => Promise<Subscription[]>;

/**
 * Creates a worker process that manages subscriptions.
 *
 * This function executes the provided callback to obtain subscriptions,
 * and sets up signal handlers to ensure proper cleanup when the process
 * is terminated. When SIGTERM or SIGINT signals are received, all subscriptions
 * are freed before the process exits.
 *
 * @param callback - A function that returns a Promise resolving to an array of Subscriptions
 * @returns A Promise that resolves when the worker is set up
 *
 * @example
 * ```ts
 * await createWorker(async () => {
 *   const client = await createClient();
 *   return [client.subscribe(...)];
 * });
 * ```
 */
export async function createWorker(
    callback: DojoWorkerCallback
): Promise<void> {
    const sub = await callback();

    process.on("SIGTERM", () => {
        for (const s of sub) {
            s.free();
        }

        process.exit(0);
    });

    process.on("SIGINT", () => {
        for (const s of sub) {
            s.free();
        }
        process.exit(0);
    });
}

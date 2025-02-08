// Create a worker to evaluate user input code.
async function createWorker(code: string) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL("./worker.ts", import.meta.url), {
            type: "module",
        });

        worker.onmessage = (event) => {
            if (event.data.type === "success") {
                resolve(event.data.result);
            }
            if (event.data.type === "error") {
                reject(event.data.error);
            }
            worker.terminate();
        };

        worker.postMessage({ code });
    });
}

export async function evaluateUserInput(query: string): Promise<any> {
    return await createWorker(query);
}

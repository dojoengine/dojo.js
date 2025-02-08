// minimal-worker.ts
console.log("Worker initializing...");

self.onmessage = (e) => {
    console.log("Worker received message:", e.data);
    self.postMessage({ type: "success", result: "test" });
};

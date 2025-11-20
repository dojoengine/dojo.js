import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";

async function main() {
    const container = document.getElementById("root");
    if (!container) {
        throw new Error("Root element not found");
    }

    createRoot(container).render(<RouterProvider router={router} />);
}

main().catch(console.error);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { dojoConfig } from "../dojoConfig";

import { App } from "./App";

async function main() {
    console.log(dojoConfig);

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

main();

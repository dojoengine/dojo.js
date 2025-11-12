import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { DojoProvider } from "@dojoengine/core";
import manifest from "../../../core/manifest_dev.json" with { type: "json" };
import { createDojoConfig } from "@dojoengine/core";
const dojoConfig = createDojoConfig({ manifest: manifest });

function Root() {
    const provider = new DojoProvider(dojoConfig.manifest);
    return <div>Hello Dojo</div>;
}

const container = document.getElementById("root");
if (!container) {
    throw new Error("Root element not found");
}

createRoot(container).render(
    <StrictMode>
        <Root />
    </StrictMode>
);

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { DojoProvider } from "./dojo/DojoContext";
import { dojoConfig, setup, type SetupResult } from "@showcase/dojo";

// function Root() {
//     const [value, setValue] = useState<SetupResult | null>(null);
//
//     useEffect(() => {
//         let mounted = true;
//         setup(dojoConfig).then((result) => {
//             if (mounted) setValue(result);
//         });
//         return () => {
//             mounted = false;
//         };
//     }, []);
//
//     if (!value) {
//         return <div className="loading">Connecting to dojo…</div>;
//     }
//
//     return (
//         <DojoProvider value={value}>
//             <App />
//         </DojoProvider>
//     );
// }
function Root() {
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

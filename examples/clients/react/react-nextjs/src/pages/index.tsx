import { useEffect, useState } from "react";
import { DojoProvider } from "../dojo/DojoContext";
import { dojoConfig } from "../dojoConfig";
import { setup, SetupResult } from "../dojo/generated/setup";
import App from "@/App";

export default function Home() {
    const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
    useEffect(() => {
        setup(dojoConfig)
            .then((result) => {
                setSetupResult(result);
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    if (!setupResult) {
        return <div>Loading....</div>;
    }

    return (
        <DojoProvider value={setupResult}>
            <App />
        </DojoProvider>
    );
}

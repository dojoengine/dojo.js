import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";

import { useAccount } from "@starknet-start/react";
import { useDojoSDK, useEntityQuery } from "@dojoengine/sdk/react";
import "./App.css";

function App() {
    const { client } = useDojoSDK();
    const { address } = useAccount();

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                // Querying models that have at least [address] as a key
                KeysClause([], [address], "VariableLen").build()
            )
            .includeHashedKeys()
    );

    return (
        <div className="app">
            <h1>Welcome to Dojo.js</h1>
            {client ? (
                <p>✅ Dojo SDK initialized successfully!</p>
            ) : (
                <p>❌ Failed to initialize Dojo SDK</p>
            )}
            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
                href="https://book.dojoengine.org/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn Dojo
            </a>
        </div>
    );
}

export default App;

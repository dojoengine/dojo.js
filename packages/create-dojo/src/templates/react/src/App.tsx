import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";

import { useAccount } from "@starknet-react/core";
import { useDojoSDK, useEntityId, useEntityQuery } from "@dojoengine/sdk/react";
import "./App.css";

function App() {
    const { useDojoStore, client } = useDojoSDK();
    const { account } = useAccount();
    const entities = useDojoStore((state) => state.entities);

    const entityId = useEntityId(account?.address ?? "0");

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                // Querying Moves and Position models that has at least [account.address] as key
                KeysClause([], [undefined], "VariableLen").build()
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

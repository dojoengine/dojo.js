<script lang="ts">
import { onMount } from "svelte";
import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../../dojoConfig";

let sdk: any = null;
let loading = true;

onMount(async () => {
    try {
        sdk = await init(
            {
                client: {
                    rpcUrl: dojoConfig.rpcUrl,
                    toriiUrl: dojoConfig.toriiUrl,
                    relayUrl: dojoConfig.relayUrl,
                    worldAddress: dojoConfig.manifest.world.address,
                },
                domain: {
                    name: "MyDojoApp",
                    version: "1.0.0",
                    chainId: "0x534e5f5345504f4c4941",
                    revision: 1,
                },
            },
            {} // models will be imported here
        );
    } catch (error) {
        console.error("Failed to initialize Dojo:", error);
    } finally {
        loading = false;
    }
});
</script>

<main>
    <h1>Welcome to Dojo.js</h1>
    {#if loading}
        <p>Initializing Dojo...</p>
    {:else if sdk}
        <p>✅ Dojo SDK initialized successfully!</p>
    {:else}
        <p>❌ Failed to initialize Dojo SDK</p>
    {/if}
    <p>
        Edit <code>src/routes/+page.svelte</code> and save to reload.
    </p>
    <a href="https://book.dojoengine.org/" target="_blank" rel="noopener noreferrer">
        Learn Dojo
    </a>
</main>

<style>
    main {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    h1 {
        font-size: 3.2em;
        line-height: 1.1;
    }

    a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
    }

    a:hover {
        color: #535bf2;
    }

    code {
        background-color: #1a1a1a;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: monospace;
    }
</style>
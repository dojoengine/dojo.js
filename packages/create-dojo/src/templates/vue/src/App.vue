<script setup lang="ts">
import { ref, onMounted } from "vue";
import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../dojoConfig";

const sdk = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const dojoSdk = await init(
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
        sdk.value = dojoSdk;
    } catch (error) {
        console.error("Failed to initialize Dojo:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="app">
        <h1>Welcome to Dojo.js</h1>
        <div v-if="loading">Initializing Dojo...</div>
        <div v-else>
            <p v-if="sdk">✅ Dojo SDK initialized successfully!</p>
            <p v-else>❌ Failed to initialize Dojo SDK</p>
        </div>
        <p>Edit <code>src/App.vue</code> and save to reload.</p>
        <a href="https://book.dojoengine.org/" target="_blank">Learn Dojo</a>
    </div>
</template>

<style scoped>
.app {
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

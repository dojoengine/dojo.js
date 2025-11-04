<script lang="ts">
import type { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { DirectionValue } from "@showcase/dojo";

import {
    componentValueStore,
    type ComponentStore,
} from "./dojo/componentValueStore";
import {
    handleBurnerChange,
    handleClearBurners,
    handleNewBurner,
} from "./dojo/handlers";
import { accountStore, burnerStore, dojoStore } from "./dojo/stores";

let entityId: Entity | undefined;
let positionStore: ComponentStore | undefined;
let movesStore: ComponentStore | undefined;
let clipboardMessage = "";
let clipboardError = false;

$: setup = $dojoStore;
$: account = $accountStore;
$: burners = $burnerStore;

$: if (account) {
    entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
} else {
    entityId = undefined;
}

$: if (setup && entityId) {
    positionStore = componentValueStore(
        setup.clientComponents.Position,
        entityId
    );
    movesStore = componentValueStore(setup.clientComponents.Moves, entityId);
} else {
    positionStore = undefined;
    movesStore = undefined;
}

function showMessage(message: string, isError = false) {
    clipboardMessage = message;
    clipboardError = isError;
    setTimeout(() => {
        clipboardMessage = "";
        clipboardError = false;
    }, 2500);
}

async function copyBurners() {
    if (!setup) return;
    await setup.burnerManager.copyToClipboard();
    showMessage("Burners copied to clipboard");
}

async function restoreBurners() {
    if (!setup) return;
    try {
        await setup.burnerManager.applyFromClipboard();
        burnerStore.set(setup.burnerManager.list());
        accountStore.set(setup.burnerManager.getActiveAccount());
        showMessage("Burners restored");
    } catch (error) {
        console.error(error);
        showMessage("Failed to restore burners", true);
    }
}
</script>

<main>
    {#if !setup}
        <p>Connecting to dojo…</p>
    {:else}
        <section>
            <button on:click={handleNewBurner}>
                {setup.burnerManager.isDeploying
                    ? "Deploying burner"
                    : "Create burner"}
            </button>
            {#if burners.length > 0}
                <button on:click={copyBurners}>Save burners to clipboard</button>
            {/if}
            <button on:click={restoreBurners}>Restore burners from clipboard</button>
            {#if clipboardMessage}
                <p class="feedback" class:error={clipboardError}>
                    {clipboardMessage}
                </p>
            {/if}
        </section>

        <section>
            <p>{`Burners deployed: ${burners.length}`}</p>
            <label class="select">
                <span>Select signer</span>
                <select on:change={handleBurnerChange}>
                    {#each burners as burner}
                        <option
                            value={burner.address}
                            selected={account && burner.address === account.address}
                        >
                            {burner.address}
                        </option>
                    {/each}
                </select>
            </label>
            <button on:click={handleClearBurners}>Clear burners</button>
        </section>

        <section>
            <button
                on:click={() =>
                    account && setup.systemCalls.spawn(account)
                }
            >
                Spawn
            </button>
            <p>
                Moves left:
                {#if movesStore}
                    {$movesStore?.remaining}
                {:else}
                    Need to spawn
                {/if}
            </p>
            <p>
                Position:
                {#if positionStore}
                    {$positionStore?.vec.x}, {$positionStore?.vec.y}
                {:else}
                    Need to spawn
                {/if}
            </p>
        </section>

        <section>
            <button
                on:click={() =>
                    account && positionStore && $positionStore?.vec.y > 0
                        ? setup.systemCalls.move(account, DirectionValue.Up())
                        : null
                }
            >
                Up
            </button>
            <div class="row">
                <button
                    on:click={() =>
                        account && positionStore && $positionStore?.vec.x > 0
                            ? setup.systemCalls.move(account, DirectionValue.Left())
                            : null
                    }
                >
                    Left
                </button>
                <button
                    on:click={() =>
                        account && setup.systemCalls.move(account, DirectionValue.Right())
                    }
                >
                    Right
                </button>
            </div>
            <button
                on:click={() =>
                    account && setup.systemCalls.move(account, DirectionValue.Down())
                }
            >
                Down
            </button>
        </section>
    {/if}
</main>

<script lang="ts">
    import type { Entity } from "@dojoengine/recs";
    import {
        componentValueStore,
        type ComponentStore,
    } from "./dojo/componentValueStore";
    import { dojoStore, accountStore, burnerStore } from "./stores";
    import { Account } from "starknet";
    import { type Burner } from "@dojoengine/create-burner";
    import {
        handleBurnerChange,
        handleNewBurner,
        handleClearBurners,
    } from "./handlers";

    let entityId: Entity;
    let account: Account;
    let position: ComponentStore;
    let moves: ComponentStore;
    let burners: Burner[];

    $: ({ clientComponents, torii, burnerManager, client } = $dojoStore);
    $: if ($accountStore) account = $accountStore;

    $: if (torii && account)
        entityId = torii.poseidonHash([account.address]) as Entity;

    $: if (dojoStore)
        position = componentValueStore(clientComponents.Position, entityId);
    $: if (dojoStore)
        moves = componentValueStore(clientComponents.Moves, entityId);
    $: if ($burnerStore) burners = $burnerStore;
</script>

<main>
    {#if $dojoStore}
        <p>Setup completed</p>
    {:else}
        <p>Setting up...</p>
    {/if}

    <button on:click={handleNewBurner}>
        {burnerManager?.isDeploying ? "deploying burner" : "create burner"}
    </button>

    <div class="card">
        <div>{`burners deployed: ${burners.length}`}</div>
        <div>
            select signer:{" "}
            <select on:change={handleBurnerChange}>
                {#each burners as burner}
                    <option value={burner.address}>
                        {burner.address}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <button on:click={handleClearBurners}> Clear burners </button>
        </div>
    </div>

    <div class="card">
        <button on:click={() => client.actions.spawn({ account })}>Spawn</button
        >
        <div>
            Moves Left: {moves ? `${$moves?.remaining}` : "Need to Spawn"}
        </div>
        <div>
            Position:{" "}
            {position
                ? `${$position?.vec.x}, ${$position?.vec.y}`
                : "Need to Spawn"}
        </div>

        <div>{$moves && $moves.last_direction}</div>
    </div>

    <div class="card">
        <div>
            <button
                on:click={() =>
                    position && $position.vec.y > 0
                        ? client.actions.move({
                              account,
                              direction: { type: "Up" },
                          })
                        : console.log("Reach the borders of the world.")}
            >
                Move Up
            </button>
        </div>
        <div>
            <button
                on:click={() =>
                    position && $position.vec.x > 0
                        ? client.actions.move({
                              account,
                              direction: { type: "Left" },
                          })
                        : console.log("Reach the borders of the world.")}
            >
                Move Left
            </button>
            <button
                on:click={() =>
                    client.actions.move({
                        account,
                        direction: { type: "Right" },
                    })}
            >
                Move Right
            </button>
        </div>
        <div>
            <button
                on:click={() =>
                    client.actions.move({
                        account,
                        direction: { type: "Down" },
                    })}
            >
                Move Down
            </button>
        </div>
    </div>
</main>

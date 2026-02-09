<template>
    <main>
        <section v-if="loading">
            <p>Connecting to dojo…</p>
        </section>
        <template v-else>
            <section>
                <button @click="createBurner">
                    {{ deploying ? "Deploying burner" : "Create burner" }}
                </button>
                <button v-if="burners.length" @click="copyBurners">
                    Save burners to clipboard
                </button>
                <button @click="restoreBurners">Restore burners from clipboard</button>
                <p v-if="clipboardMessage" :class="['feedback', { error: clipboardError }]">
                    {{ clipboardMessage }}
                </p>
            </section>

            <section>
                <p>Burners deployed: {{ burners.length }}</p>
                <label class="select">
                    <span>Select signer</span>
                    <select :value="activeAccount?.address" @change="selectBurner">
                        <option v-for="burner in burners" :key="burner.address" :value="burner.address">
                            {{ burner.address }}
                        </option>
                    </select>
                </label>
                <button @click="clearBurners">Clear burners</button>
            </section>

            <section>
                <button @click="spawn">Spawn</button>
                <p>
                    Moves left:
                    <span v-if="moves">{{ moves.remaining }}</span>
                    <span v-else>Need to spawn</span>
                </p>
                <p>
                    Position:
                    <span v-if="position">{{ position.vec.x }}, {{ position.vec.y }}</span>
                    <span v-else>Need to spawn</span>
                </p>
            </section>

            <section>
                <button @click="moveUp">Up</button>
                <div class="row">
                    <button @click="moveLeft">Left</button>
                    <button @click="moveRight">Right</button>
                </div>
                <button @click="moveDown">Down</button>
            </section>
        </template>
    </main>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, watchEffect } from "vue";
import type { Entity } from "@dojoengine/recs";
import { getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import type { Burner } from "@dojoengine/create-burner";
import type { Account } from "starknet";

import { DirectionValue, dojoConfig, setup, type SetupResult } from "@showcase/dojo";
import type { Direction, Position as PositionModel, Moves as MovesModel } from "@showcase/dojo";

// ---------------------------------------------------------------------------
// ABI-derived types from @showcase/dojo (see core/types.ts):
//   Position → { player: string; vec: { x: number; y: number } }
//   Moves    → { player: string; remaining: number; ... }
// ---------------------------------------------------------------------------

const loading = ref(true);
const deploying = ref(false);
const setupResult = ref<SetupResult | null>(null);
const burners = ref<Burner[]>([]);
const activeAccount = ref<Account | null>(null);
const clipboardMessage = ref("");
const clipboardError = ref(false);
const position = ref<PositionModel | null>(null);
const moves = ref<MovesModel | null>(null);

let positionSubscription: { unsubscribe: () => void } | null = null;
let movesSubscription: { unsubscribe: () => void } | null = null;

function resetSubscriptions() {
    positionSubscription?.unsubscribe();
    positionSubscription = null;
    movesSubscription?.unsubscribe();
    movesSubscription = null;
}

function showMessage(message: string, isError = false) {
    clipboardMessage.value = message;
    clipboardError.value = isError;
    window.setTimeout(() => {
        clipboardMessage.value = "";
        clipboardError.value = false;
    }, 2500);
}

async function initialise() {
    const result = await setup(dojoConfig);
    setupResult.value = result;
    burners.value = result.burnerManager.list();
    activeAccount.value =
        result.burnerManager.getActiveAccount() ?? result.masterAccount;
    loading.value = false;
}

function entityId(): Entity | null {
    if (!activeAccount.value) return null;
    return getEntityIdFromKeys([BigInt(activeAccount.value.address)]) as Entity;
}

function selectBurner(event: Event) {
    if (!setupResult.value) return;
    const target = event.target as HTMLSelectElement;
    setupResult.value.burnerManager.select(target.value);
    activeAccount.value = setupResult.value.burnerManager.getActiveAccount();
    burners.value = setupResult.value.burnerManager.list();
}

async function createBurner() {
    if (!setupResult.value) return;
    deploying.value = true;
    await setupResult.value.burnerManager.create();
    burners.value = setupResult.value.burnerManager.list();
    activeAccount.value = setupResult.value.burnerManager.getActiveAccount();
    deploying.value = false;
}

function clearBurners() {
    if (!setupResult.value) return;
    setupResult.value.burnerManager.clear();
    burners.value = setupResult.value.burnerManager.list();
    activeAccount.value = null;
}

async function copyBurners() {
    if (!setupResult.value) return;
    await setupResult.value.burnerManager.copyToClipboard();
    showMessage("Burners copied to clipboard");
}

async function restoreBurners() {
    if (!setupResult.value) return;
    try {
        await setupResult.value.burnerManager.applyFromClipboard();
        burners.value = setupResult.value.burnerManager.list();
        activeAccount.value = setupResult.value.burnerManager.getActiveAccount();
        showMessage("Burners restored");
    } catch (error) {
        console.error(error);
        showMessage("Failed to restore burners", true);
    }
}

async function spawn() {
    if (!setupResult.value || !activeAccount.value) return;
    await setupResult.value.systemCalls.spawn(activeAccount.value);
}

function move(direction: Direction) {
    if (!setupResult.value || !activeAccount.value) return;
    setupResult.value.systemCalls.move(activeAccount.value, direction);
}

function moveUp() {
    if (position.value?.vec && position.value.vec.y > 0) {
        move(DirectionValue.Up());
    }
}

function moveDown() {
    move(DirectionValue.Down());
}

function moveLeft() {
    if (position.value?.vec && position.value.vec.x > 0) {
        move(DirectionValue.Left());
    }
}

function moveRight() {
    move(DirectionValue.Right());
}

watchEffect(() => {
    resetSubscriptions();

    if (!setupResult.value || !activeAccount.value) {
        position.value = null;
        moves.value = null;
        return;
    }

    const id = entityId();
    if (!id) return;

    const { clientComponents } = setupResult.value;

    position.value = getComponentValue(clientComponents.Position, id) as PositionModel | undefined ?? null;
    moves.value = getComponentValue(clientComponents.Moves, id) as MovesModel | undefined ?? null;

    positionSubscription = clientComponents.Position.update$.subscribe(
        (update) => {
            if (update.entity === id) {
                const [next] = update.value;
                position.value = next as typeof position.value;
            }
        }
    );

    movesSubscription = clientComponents.Moves.update$.subscribe((update) => {
        if (update.entity === id) {
            const [next] = update.value;
            moves.value = next as typeof moves.value;
        }
    });
});

onMounted(initialise);
onBeforeUnmount(() => {
    resetSubscriptions();
});
</script>

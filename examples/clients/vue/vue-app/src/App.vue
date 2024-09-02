<script setup lang="ts">
import { ref, onMounted, watch, toRaw, reactive } from "vue";
import { dojoConfig } from "../dojoConfig.ts";
import { createAccount, getAccount, useComponentValue } from "./utils";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { setup } from "./dojo/setup.ts";
import { Direction } from "./dojo/typescript/models.gen.ts";

const dojoContext = reactive<any>({
    setup: null,
    account: null,
});
const position = ref<any>(null);
const moves = ref<any>(null);
const isDeploying = ref(false);

const create = async () => {
    if (isDeploying.value) return;
    const classHash = dojoContext.setup.config.accountClassHash;
    const nodeUrl = dojoContext.setup.config.rpcUrl;
    isDeploying.value = true;
    dojoContext.account = await createAccount({ nodeUrl, classHash });
    isDeploying.value = false;
};

const spawnFun = async () => {
    if (!dojoContext.account) {
        console.log("No account");
        alert("No account");
        return;
    }
    let { spawn } = dojoContext.setup.systemCalls;
    await spawn(dojoContext.account);
};

const moveFun = async (direction: Direction) => {
    const account = dojoContext.account;
    if (!account) {
        console.log("No account");
        alert("No account");
        return;
    }
    let { move } = dojoContext.setup.systemCalls;
    await move(account, direction);
};

onMounted(async () => {
    const setupResult = await setup(dojoConfig);
    const account = await getAccount(setupResult.config.rpcUrl);
    dojoContext.setup = setupResult;
    dojoContext.account = account;
});

watch(
    () => dojoContext.account,
    (newAccount) => {
        if (newAccount) {
            const entityId = getEntityIdFromKeys([
                BigInt(newAccount.address),
            ]) as Entity;
            const { Position, Moves } = dojoContext.setup.clientComponents;
            const positionRef = useComponentValue(toRaw(Position), entityId);
            const movesRef = useComponentValue(toRaw(Moves), entityId);
            watch(
                () => [positionRef, movesRef],
                ([positionData, movesData]) => {
                    position.value = positionData?.value;
                    moves.value = movesData?.value;
                },
                { immediate: true, deep: true }
            );
        }
    }
);
</script>

<template>
    <div v-if="dojoContext.setup">
        <button @click="create">
            {{ isDeploying ? "deploying burner" : "create burner" }}
        </button>
        <div class="card">address: {{ dojoContext.account?.address }}</div>
        <div class="card">
            <button @click="spawnFun">Spawn</button>
            <div>
                Moves Left:
                {{ moves ? `${moves?.remaining}` : "Need to Spawn" }}
            </div>
            <div>
                Position:
                {{
                    position
                        ? `${position?.vec?.x}, ${position?.vec?.y}`
                        : "Need to Spawn"
                }}
            </div>
        </div>
        <div className="card">
            <div>
                <button
                    @click="
                        () =>
                            position && position.vec.y > 0
                                ? moveFun(Direction.Up)
                                : console.log(`Reach the borders of the world.`)
                    "
                >
                    Move Up
                </button>
            </div>
            <div>
                <button
                    @click="
                        () =>
                            position && position.vec.x > 0
                                ? moveFun(Direction.Left)
                                : console.log(`Reach the borders of the world.`)
                    "
                >
                    Move Left
                </button>
                <button @click="moveFun(Direction.Right)">Move Right</button>
            </div>
            <div>
                <button @click="moveFun(Direction.Down)">Move Down</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

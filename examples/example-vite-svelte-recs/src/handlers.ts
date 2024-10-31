import { get } from "svelte/store";
import { dojoStore, accountStore, burnerStore } from "./stores";
import type { BurnerManager } from "@dojoengine/create-burner";

let burnerManager: BurnerManager;

export function handleBurnerChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    burnerManager = get(dojoStore).burnerManager;
    burnerManager.select(target.value);
    accountStore.set(burnerManager.getActiveAccount());
}

export async function handleNewBurner() {
    burnerManager = get(dojoStore).burnerManager;
    await burnerManager.create();
    burnerStore.set(burnerManager.list());
    accountStore.set(burnerManager.getActiveAccount());
}

export function handleClearBurners() {
    burnerManager = get(dojoStore).burnerManager;
    burnerManager.clear();
    burnerStore.set(burnerManager.list());
    accountStore.set(null);
}

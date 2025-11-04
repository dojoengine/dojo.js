import { get } from "svelte/store";

import { accountStore, burnerStore, dojoStore } from "./stores";

export function handleBurnerChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const burnerManager = get(dojoStore).burnerManager;
    burnerManager.select(target.value);
    accountStore.set(burnerManager.getActiveAccount());
    burnerStore.set(burnerManager.list());
}

export async function handleNewBurner() {
    const burnerManager = get(dojoStore).burnerManager;
    await burnerManager.create();
    burnerStore.set(burnerManager.list());
    accountStore.set(burnerManager.getActiveAccount());
}

export function handleClearBurners() {
    const burnerManager = get(dojoStore).burnerManager;
    burnerManager.clear();
    burnerStore.set(burnerManager.list());
    accountStore.set(null);
}

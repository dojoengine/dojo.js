import { get } from "svelte/store";
import { dojo, account, burners } from "./stores";
import type { BurnerManager } from "@dojoengine/create-burner";

let burnerManager: BurnerManager;

export function handleBurnerChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const { burnerManager }: any = get(dojo);
    burnerManager.select(target.value);
    account.set(burnerManager.getActiveAccount());
}

export async function handleNewBurner() {
    const { burnerManager }: any = get(dojo);
    await burnerManager.create();
    burners.set(burnerManager.list());
    account.set(burnerManager.getActiveAccount());
}

export function handleClearBurners() {
    const { burnerManager }: any = get(dojo);
    burnerManager.clear();
    burners.set(burnerManager.list());
    account.set(null);
}

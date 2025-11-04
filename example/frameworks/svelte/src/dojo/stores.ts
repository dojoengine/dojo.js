import { writable } from "svelte/store";
import type { Burner } from "@dojoengine/create-burner";
import type { SetupResult } from "@showcase/dojo";
import type { Account } from "starknet";

export const dojoStore = writable<SetupResult>();
export const accountStore = writable<Account | null>();
export const burnerStore = writable<Burner[]>([]);

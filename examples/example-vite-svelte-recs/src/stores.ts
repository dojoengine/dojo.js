import { writable } from "svelte/store";
import { type SetupResult } from "./dojo/setup";
import { Account } from "starknet";
import { type Burner } from "@dojoengine/create-burner";

export const dojoStore = writable<SetupResult>();
export const accountStore = writable<Account | null>();

export const burnerStore = writable<Burner[]>();

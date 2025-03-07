import { type SetupResult } from "./dojo/setup";
import { Account } from "starknet";
import { writable } from "svelte/store";
import { type Burner } from "@dojoengine/create-burner";

export const dojo = writable<SetupResult>();
export const account = writable<Account | null>();
export const burners = writable<Burner[]>();

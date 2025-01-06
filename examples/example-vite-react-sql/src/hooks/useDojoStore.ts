import { createDojoStore } from "@dojoengine/sdk";
import { SchemaType } from "@/typescript/models.gen";

/**
 * Global store for managing Dojo game state.
 */
export const useDojoStore = createDojoStore<SchemaType>();

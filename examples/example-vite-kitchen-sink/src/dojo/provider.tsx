import { SchemaType, schema } from "../typescript/models.gen";
import { createContext, useContext, useEffect, useState } from "react";
import type { SDK } from "@dojoengine/sdk";
import { DojoProvider } from "@dojoengine/core";
import { setupWorld } from "@/typescript/contracts.gen";

export function useDojoDb() {
    return useContext(DojoContext);
}

export interface DojoContextInterface {
    db?: SDK<SchemaType>;
    provider?: DojoProvider;
    actions?: typeof setupWorld;
}

export const DojoContext = createContext<DojoContextInterface>({
    db: undefined,
    provider: undefined,
    actions: undefined,
});

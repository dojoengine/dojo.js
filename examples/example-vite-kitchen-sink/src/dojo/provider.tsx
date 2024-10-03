import { OnchainDashSchemaType, schema } from "./models";
import { createContext, useContext, useEffect, useState } from "react";
import type { SDK } from "@dojoengine/sdk";

export function useDojoDb() {
  return useContext(DojoContext);
}

export const DojoContext = createContext<SDK<OnchainDashSchemaType> | null>(null);
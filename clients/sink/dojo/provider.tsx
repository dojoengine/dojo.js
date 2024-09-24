"use client"

import { OnchainDashSchemaType, schema } from "./models";
import { createContext, useContext, useEffect, useState } from "react";
import type { SDK } from "@dojoengine/sdk";
import { env, getRpcUrl } from "@/env";

export function useDojoDb() {
  return useContext(DojoContext);
}

export const DojoContext = createContext<SDK<OnchainDashSchemaType> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DojoProviderProps {
}
export default function DojoProvider({ children }: React.PropsWithChildren<DojoProviderProps>) {
  const [db, setDb] = useState<SDK<OnchainDashSchemaType> | null>(null);
  useEffect(() => {
    if (db === null && undefined !== window) {
      import("@dojoengine/sdk").then(({ init }) => {
        init<OnchainDashSchemaType>(
          {
            client: {
              rpcUrl: getRpcUrl(),
              toriiUrl: env.NEXT_PUBLIC_TORII_URL,
              relayUrl: "",
              worldAddress: "0x6dd367f5e11f11e0502cb2c4db7ae9bb6d8b5a4a431750bed7bec88b218e12",
            },
            domain: {
              name: "OnChainDash",
              revision: "1",
            },
          },
          schema
        ).then(setDb).catch(console.error);

      });
    }
  }, [db, setDb])

  return (
    <DojoContext.Provider value={db}>
      {children}
    </DojoContext.Provider >
  )
}

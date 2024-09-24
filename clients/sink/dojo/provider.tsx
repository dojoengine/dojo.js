"use client"

import { OnchainDashSchemaType, schema } from "./models";
import { createContext, useContext, useEffect, useState } from "react";
import type { SDK } from "@dojoengine/sdk";

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
              rpcUrl: "http://localhost:5050",
              toriiUrl: "http://localhost:8080",
              relayUrl: "",
              worldAddress: "0x474cd7db48e8cc15b5d1c5151f6c423a7fe3818116fefd987c7780a4756522f",
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

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_RPC_URL: z.string(),
    VITE_RPC_API_KEY: z.string(),
    VITE_CONTROLLER_URL: z.string(),
    VITE_CONTROLLER_RPC: z.string(),
    VITE_TORII_URL: z.string(),
    VITE_RELAY_URL: z.string(),
  },
  runtimeEnv: import.meta.env,
});

export function getRpcUrl() {
  return env.VITE_RPC_URL + ("" !== env.VITE_RPC_API_KEY ? "?apikey=" + env.VITE_RPC_API_KEY : "");
}

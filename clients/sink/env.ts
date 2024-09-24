import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_RPC_URL: z.string(),
    NEXT_PUBLIC_RPC_API_KEY: z.string(),
    NEXT_PUBLIC_CONTROLLER_URL: z.string(),
    NEXT_PUBLIC_CONTROLLER_RPC: z.string(),
    NEXT_PUBLIC_TORII_URL: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_RPC_API_KEY: process.env.NEXT_PUBLIC_RPC_API_KEY,
    NEXT_PUBLIC_CONTROLLER_URL: process.env.NEXT_PUBLIC_CONTROLLER_URL,
    NEXT_PUBLIC_CONTROLLER_RPC: process.env.NEXT_PUBLIC_CONTROLLER_RPC,
    NEXT_PUBLIC_TORII_URL: process.env.NEXT_PUBLIC_TORII_URL,
  }
});

export function getRpcUrl() {
  return env.NEXT_PUBLIC_RPC_URL + ("" !== env.NEXT_PUBLIC_RPC_API_KEY ? "?apikey=" + env.NEXT_PUBLIC_RPC_API_KEY : "");
}

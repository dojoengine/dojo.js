import { LOCAL_KATANA } from "@dojoengine/core";
import { RpcProvider, Account } from "starknet";
import { Dojo_Starter } from "./dojo_starter";

const provider = new RpcProvider({ nodeUrl: LOCAL_KATANA });
const masterAccount = new Account(
    provider,
    "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
    "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a"
);

export const dojo_starter = new Dojo_Starter({
    toriiUrl: "http://localhost:8080",
    account: masterAccount,
});

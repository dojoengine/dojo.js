import { LOCAL_KATANA } from "@dojoengine/core";
import { Dojo_Starter } from "./dojo_starter";

export const dojo_starter = new Dojo_Starter({
    rpcUrl: LOCAL_KATANA,
    toriiUrl: "http://localhost:8080",
    worldAddress:
        "0x28f5999ae62fec17c09c52a800e244961dba05251f5aaf923afabd9c9804d1a",
});

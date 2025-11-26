import { Atom } from "@effect-atom/atom-react";
import { Layer } from "effect";
import { makeToriiLayer } from "@dojoengine/react/effect";
import { TracingLive } from "../tracing";
import manifest from "../../manifest_sepolia.json" with { type: "json" };

const toriiLayer = makeToriiLayer(
    { manifest, toriiUrl: "https://api.cartridge.gg/x/nums-bal/torii" },
    { autoReconnect: false, maxReconnectAttempts: 5 }
);

const AppLayer = Layer.merge(toriiLayer, TracingLive);

export const toriiRuntime = Atom.runtime(AppLayer);

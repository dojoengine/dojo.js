import { Atom } from "@effect-atom/atom-react";
import { Layer } from "effect";
import { makeToriiLayer } from "@dojoengine/react/effect";
import { TracingLive } from "../tracing";
import manifest from "../../../../../core/manifest_dev.json" with {
    type: "json",
};

const toriiLayer = makeToriiLayer(
    { manifest, toriiUrl: "http://localhost:8080" },
    { autoReconnect: false, maxReconnectAttempts: 5 }
);

const AppLayer = Layer.merge(toriiLayer, TracingLive);

export const toriiRuntime = Atom.runtime(AppLayer);

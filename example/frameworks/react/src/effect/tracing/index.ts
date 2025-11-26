import { makeTracingLayer } from "@dojoengine/react/effect";

export const TracingLive = makeTracingLayer({
    serviceName: "dojo-react-app",
    enabled: () => import.meta.env.DEV,
});

import { Schema } from "./schema";
import { Metrics } from "./metrics";
import { PlayerActions } from "./action";

export function Playground() {
    return (
        <>
            <Schema />
            <PlayerActions />
            <Metrics />
        </>
    );
}

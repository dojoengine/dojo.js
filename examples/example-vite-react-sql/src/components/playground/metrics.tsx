import { DirectionCount } from "./direction-count";
import { TotalEntities } from "./total-entities";

export function Metrics() {
    return (
        <div>
            <h2 className="mb-6">Now something you can do is</h2>
            <div className="grid grid-cols-4 gap-4">
                <TotalEntities />
                <DirectionCount />
            </div>
        </div>
    );
}

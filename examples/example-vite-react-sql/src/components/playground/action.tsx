import { useModel } from "@/hooks/useModel";
import { usePlayerActions } from "@/hooks/usePlayerActions";
import { Direction, ModelsMapping } from "@/typescript/models.gen";
import { useAccount } from "@starknet-react/core";
import { Button } from "../ui/button";
import { useSystemCalls } from "@/hooks/useSystemCalls";
import { cn } from "@/lib/utils";

const containerClass = "min-h-[150px]";

export function PlayerActions() {
    const { address } = useAccount();

    const entityId = usePlayerActions(address);
    const { spawn: spawnCallback, move: moveCallback } =
        useSystemCalls(entityId);

    const moves = useModel(entityId as string, ModelsMapping.Moves);
    const position = useModel(entityId as string, ModelsMapping.Position);

    if (!address) {
        return <div className={cn(containerClass)}>⚠️ Please connect</div>;
    }

    if (undefined === moves && undefined === position) {
        return (
            <div className={cn(containerClass)}>
                <Button variant="outline" onClick={spawnCallback}>
                    Spawn
                </Button>
            </div>
        );
    }

    return (
        <div className={cn(containerClass)}>
            <Button
                variant="outline"
                onClick={async () => await moveCallback(Direction.Left)}
            >
                Left
            </Button>
            <Button
                variant="outline"
                onClick={async () => await moveCallback(Direction.Up)}
            >
                Up
            </Button>
            <Button
                variant="outline"
                onClick={async () => await moveCallback(Direction.Down)}
            >
                Down
            </Button>
            <Button
                variant="outline"
                onClick={async () => await moveCallback(Direction.Right)}
            >
                Right
            </Button>
        </div>
    );
}

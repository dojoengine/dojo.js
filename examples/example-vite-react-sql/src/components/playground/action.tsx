import { useModel } from "@dojoengine/sdk/react";
import { usePlayerActions } from "@/hooks/usePlayerActions";
import { ModelsMapping } from "@/typescript/models.gen";
import { useAccount } from "@starknet-react/core";
import { Button } from "../ui/button";
import { useSystemCalls } from "@/hooks/useSystemCalls";
import { cn } from "@/lib/utils";
import { CairoCustomEnum } from "starknet";

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
                onClick={async () =>
                    await moveCallback(new CairoCustomEnum({ Left: "()" }))
                }
            >
                Left
            </Button>
            <Button
                variant="outline"
                onClick={async () =>
                    await moveCallback(new CairoCustomEnum({ Up: "()" }))
                }
            >
                Up
            </Button>
            <Button
                variant="outline"
                onClick={async () =>
                    await moveCallback(new CairoCustomEnum({ Down: "()" }))
                }
            >
                Down
            </Button>
            <Button
                variant="outline"
                onClick={async () =>
                    await moveCallback(new CairoCustomEnum({ Right: "()" }))
                }
            >
                Right
            </Button>
        </div>
    );
}

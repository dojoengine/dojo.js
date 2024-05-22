import { useDojo } from "../dojo/useDojo";
import { Button } from "@/components/ui/button";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useState, useEffect } from "react";

export const UIContainer = () => {
    const {
        burnerManager: { account },
        setup: {
            client: { actions },
            clientComponents: { Moves },
        },
    } = useDojo();

    const [entityId, setEntityId] = useState<Entity | undefined>(undefined);

    useEffect(() => {
        if (account) {
            const newEntityId = getEntityIdFromKeys([
                BigInt(account.address),
            ]) as Entity;
            setEntityId(newEntityId);
        } else {
            setEntityId(undefined);
        }
    }, [account]);

    const player = useComponentValue(Moves, entityId);

    return (
        account && (
            <div className="flex space-x-3 justify-between p-2 flex-wrap">
                <Button
                    variant={"default"}
                    onClick={() => actions.spawn({ account })}
                >
                    Spawn
                </Button>
                <div className="h-12 w-48 bg-white flex justify-center items-center border-2">
                    {player?.remaining}
                </div>
            </div>
        )
    );
};

import { useDojo } from "../dojo/useDojo";
import { Button } from "@/components/ui/button";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const UIContainer = () => {
    const {
        account: { account },
        setup: {
            client: { actions },
            clientComponents: { Moves },
        },
    } = useDojo();

    const player = useComponentValue(
        Moves,
        getEntityIdFromKeys([BigInt(account.address)]) as Entity
    );

    return (
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
    );
};

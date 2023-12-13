import { useDojo } from "./hooks/useDojo";
import { Button } from "./button";
import { useUIStore } from "../store";
import { useEffect } from "react";

export const Spawn = () => {
    const setLoggedIn = useUIStore((state: any) => state.setLoggedIn);
    const {
        account: { account, isDeploying },
        systemCalls: { spawn },
    } = useDojo();

    useEffect(() => {
        if (isDeploying) {
            return;
        }

        if (account) {
            return;
        }
    }, [account]);

    if (!account) {
        return <div>Deploying...</div>;
    }

    return (
        <div className="flex space-x-3 justify-between p-2 flex-wrap">
            <Button
                variant={"default"}
                onClick={async () => {
                    await spawn({
                        signer: account,
                    });

                    setLoggedIn();
                }}
            >
                Spawn
            </Button>
        </div>
    );
};

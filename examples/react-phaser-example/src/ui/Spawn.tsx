import { useDojo } from "../hooks/useDojo";
import { RPSSprites } from "../phaser/config/constants";
import { ClickWrapper } from "./ClickWrapper";
import { Button } from "../components/ui/button";
import { useUIStore } from "../store/store";
import { useEffect } from "react";

export const Spawn = () => {
    const setLoggedIn = useUIStore((state: any) => state.setLoggedIn);
    const {
        account: { account },
        systemCalls: { spawn },
    } = useDojo();

    // useEffect(() => {
    //     if (isDeploying) {
    //         return;
    //     }

    //     if (account) {
    //         return;
    //     }

    //     (async () => {
    //         const accounts = await list();

    //         if (accounts.length === 0) {
    //             await create();
    //         } else {
    //             await select(accounts[0].address);
    //         }
    //     })();
    // }, [account]);

    if (!account) {
        return <div>Deploying...</div>;
    }

    return (
        <ClickWrapper>
            <div className="flex space-x-3 justify-between p-2 flex-wrap">
                {Object.keys(RPSSprites)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                        <div key={key}>
                            <Button
                                variant={"default"}
                                onClick={async () => {
                                    await spawn({
                                        signer: account,
                                        rps: RPSSprites[
                                            key as keyof typeof RPSSprites
                                        ],
                                    });

                                    setLoggedIn();
                                }}
                            >
                                Spawn {key}
                            </Button>
                        </div>
                    ))}
            </div>
        </ClickWrapper>
    );
};

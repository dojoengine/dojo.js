import { useDojo } from "../hooks/useDojo";
import { RPSSprites } from "../phaser/config/constants";
import { ClickWrapper } from "./ClickWrapper";
import { Button } from "../components/ui/button";
import { useUIStore } from "../store/store";

export const Spawn = () => {
    const setLoggedIn = useUIStore((state: any) => state.setLoggedIn);
    const {
        account: { account, create, isDeploying, select, list, clear },
        systemCalls: { spawn },
        networkLayer: { sync },
    } = useDojo();

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
                                        rps: RPSSprites[key],
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
